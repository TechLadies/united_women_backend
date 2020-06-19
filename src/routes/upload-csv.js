const express = require("express");
const router = express.Router();
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const db = require("../models/index");
const Sequelize = require("sequelize");

let storage = multer.diskStorage({
  destination: "./uploads",
  filename: function(req, file, cb) {
    cb(null, file.originalname + "-" + Date.now() + ".csv");
  }
});

let upload = multer({ storage: storage });

let getFileData = function(filename) {
  let retPromise = new Promise(function(resolve, reject) {
    const rows = [];
    try {
      const readstream = fs.createReadStream(filename);
      readstream.on("error", e => {
        reject(e);
      });
      readstream
        .pipe(csv())
        .on("data", row => {
          rows.push(row);
        })
        .on("error", e => {
          console.log("e", e);
          reject(e);
        })
        .on("end", () => {
          console.log("CSV file processed successfully.");
          resolve(rows);
        });
    } catch (e) {
      reject(e);
    }
  });

  return retPromise;
};

const donorExists = async function(email) {
  try {
    const existingDonor = await db.Donor.findOne({
      where: {
        email: email
      }
    });
    return existingDonor;
  } catch {
    return null;
  }
};

const mapField = async (source, row) => {
  let result = {};
  let donor = {};
  let donation = {};

  const donorMap = {
    Benevity: {
      email: "Email",
      name: "Donor First Name",
      address: "Address",
      donationStart: "Donation Date",
    },
    "Giving.sg": {
      email: "Email",
      name: "Donor Name",
      address: "Address",
      identifier: "NRIC/FIN",
      donationStart: "Donation Date (DD/MM/YYYY)"
    },
    "Give Asia": {
      name: "Donor name",
      email: "Donor email",
      contactNo: "Donor phone",
      donationStart: "Date (in UTC)",
    }
  };

  const donationMap = {
    Benevity: {
      donationDate: "Donation Date",
      amount: "Donation Amount"
    },
    "Giving.sg": {
      donationDate: "Donation Date (DD/MM/YYYY)",
      amount: "Amount"
    },
    "Give Asia": {
      donationDate: "Date (in UTC)",
      amount: "Donation (in whole dollar)"
    }
  };

  const sourceMapping = (map, record) => {
    let sourceMapping = map[source];
    Object.entries(sourceMapping).forEach(([key, value]) => {
      record[key] = row[value];
    });
  };

  sourceMapping(donorMap, donor);
  sourceMapping(donationMap, donation);

  const oneTimeDonorFreqId = await db.DonorFrequency.getFreqId(
    db.DonorFrequency.ONE_TIME_KEY
  );
  const recurDonorFreqId = await db.DonorFrequency.getFreqId(
    db.DonorFrequency.RECURRING_KEY
  );

  const mapSalutation = async salutation => {
    let salutationId = await db.Salutation.getSalutationId(salutation);
    return salutationId;
  };

  const mapSource = async source => {
    let sourceId = await db.Source.getSourceId(source);
    return sourceId; 
  }

  donation["sourceId"] = await mapSource(source);

  if (source === "Benevity") {
    donor["name"] += " " + row["Donor Last Name"];
    donor["address"] +=
      " " +
      row["City"] +
      " " +
      row["State/Province"] +
      " " +
      row["Postal Code"];
    row["Donation Frequency"] == "Recurring"
      ? (donor["donorFrequencyId"] = recurDonorFreqId)
      : (donor["donorFrequencyId"] = oneTimeDonorFreqId);
    donor["contactNo"] = null;
    row["company"] ? donor["company"] = row["company"] : null;
  } else if (source === "Giving.sg") {
    row["Donation Type"] == "ONE-TIME"
      ? (donor["donorFrequencyId"] = oneTimeDonorFreqId)
      : (donor["donorFrequencyId"] = recurDonorFreqId);
    donor["salutation"] = row["Salutation"];
    donor["salutationId"] = await mapSalutation(row["Salutation"]);
    donor["contactNo"] = null;
  } else if (source === "Give Asia") {
    row["Frequency"] == "ONE-TIME"
      ? (donor["donorFrequencyId"] = oneTimeDonorFreqId)
      : (donor["donorFrequencyId"] = recurDonorFreqId);
  }
  result = { donor, donation };
  return result;
};

const checkConflicts = (existingDonor, donor, allConflicts) => {
  // if mismatch of info (i.e. conflict) exists, return both existing and new info
  if (
    donor["name"] !== existingDonor.name ||
    donor["phone"] !== existingDonor.phone ||
    donor["identifier"] !== existingDonor.identifier ||
    donor["salutationId"] !== existingDonor.salutationId
  ) {
    console.log(donor["name"], existingDonor.name);
    console.log(donor["phone"], existingDonor.phone);
    console.log(donor["identifier"], existingDonor.identifier);
    console.log(donor["salutationId"], existingDonor.salutationId);
    let conflict = {};
    conflict.current = existingDonor.dataValues;
    conflict.new = donor;
    console.log(conflict);
    allConflicts.push(conflict);
  }
};

let parseData = async (source, data) => {
  let allConflicts = [];
  let existingDonors = [];
  let newDonors = [];
  let toReturn = {};

  for (const row of data) {
    let email = source == "Give Asia" ? row["Donor email"] : row["Email"];
    let result = await mapField(source, row);
    if (email) {
      //checks if donor is an existing donor in the database
      let existingDonor = await donorExists(email);
      if (existingDonor != null) {
        // checks for conflict if donor exists
        //checkConflicts(existingDonor, result.donor, allConflicts);
        existingDonors.push(result);
      } else {
        newDonors.push(result);
      }
    }
  }
  if (allConflicts.length !== 0) {
    toReturn = { allConflicts };
  } else {
    toReturn = { existingDonors, newDonors };
  }
  return toReturn;
};

/*
const isEmpty = obj => {
  return Object.keys(obj).length === 0;
};
*/

router.post("", upload.single("csvdata"), async (req, res, next) => {
  let data;
  try {
    data = await getFileData(req.file.path);
    let parsedData = await parseData(req.body.source, data);
    if (parsedData.hasOwnProperty("allConflicts")) {
      // resolve conflict
      // res.redirect('/resolve-conflicts');
      // console.log(parsedData);
    } else {
      for (var obj of parsedData.existingDonors) {
        //retrieve donorID
        let donorRecord = await db.Donor.findOne({
          where: { email: obj.donor.email }
        });
        obj.donation["donorId"] = donorRecord.id;
        //create donation instance
        await db.Donation.create(obj.donation);
      }
      for (var obj of parsedData.newDonors) {
        // create donor instance
        db.Donor.create(obj.donor).then(async donorRecord => {
          obj.donation["donorId"] = donorRecord.id;
          // create donation instance
          await db.Donation.create(obj.donation);
        });
      }
      console.log(parsedData);
      return res.json(parsedData);
    }
  } catch (e) {
    data = e;
    res.status(400).json(e);
  }
});



router.post("/resolve-conflicts")


module.exports = router;
