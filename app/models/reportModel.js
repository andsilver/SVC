const mongoose = require('mongoose');


const schema = new mongoose.Schema({
  reportType: {
    type: String,
    required: true
  },
  registration: {
    type: String,
    required: true
  },
  data: {
    CertificateOfDestructionIssued: {
      type: Boolean
    },
    Colour: {
      type: String
    },
    ColourChangeCount: {
      type: Number
    },
    Data: {
      type: String
    },
    DateFirstRegistered: {
      type: String
    },
    DateFirstRegisteredUk: {
      type: String
    },
    EngineCapacity: {
      type: Number
    },
    ExportDate: {
      type: String
    },
    Exported: {
      type: Boolean
    },
    FinanceRecordCount: {
      type: Number
    },
    FinanceRecordList: {
      type: Array
    },
    FuelType: {
      type: String
    },
    GearCount: {
      type: Number
    },
    HighRiskRecordCount: {
      type: Number
    },
    HighRiskRecordList: {
      type: Array
    },
    ImportDate: {
      type: String
    },
    Imported: {
      type: Boolean
    },
    ImportedFromOutsideEu: {
      type: Boolean
    },
    ImportUsedBeforeUkRegistration: {
      type: Boolean
    },
    LatestColourChangeDate: {
      type: String
    },
    LatestKeeperChangeDate: {
      type: String
    },
    LatestV5cIssuedDate: {
      type: String
    },
    LookupStatusCode: {
      type: String
    },
    LookupStatusMessage: {
      type: String
    },
    Make: {
      type: String
    },
    MileageAnomalyDetected: {
      type: Boolean
    },
    MileageRecordCount: {
      type: Number
    },
    MileageRecordList: {
      type: Array
    },
    Model: {
      type: String
    },
    PlateChangeCount: {
      type: Number
    },
    PlateChangeList: {
      type: Array
    },
    PreviousColour: {
      type: String
    },
    PreviousKeeperCount: {
      type: Number
    },
    PreviousKeepers: {
      type: String
    },
    ScrapDate: {
      type: String
    },
    Scrapped: {
      type: Boolean
    },
    Stolen: {
      type: Boolean
    },
    StolenContactNumber: {
      type: String
    },
    StolenDate: {
      type: String
    },
    StolenInfoSource: {
      type: String
    },
    StolenMiaftrRecordCount: {
      type: Number
    },
    StolenMiaftrRecordList: {
      type: String
    },
    StolenPoliceForce: {
      type: String
    },
    StolenStatus: {
      type: String
    },
    TransmissionType: {
      type: String
    },
    VicTestDate: {
      type: String
    },
    VicTested: {
      type: Boolean
    },
    VicTestResult: {
      type: String
    },
    VinLast5: {
      type: String
    },
    Vrm: {
      type: String
    },
    WriteOffCategory: {
      type: String
    },
    WriteOffDate: {
      type: String
    },
    WriteOffRecordCount: {
      type: Number
    },
    WriteOffRecordList: {
      type: String
    },
    WrittenOff: {
      type: Boolean
    },
    YearOfManufacture: {
      type: String
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Report', schema);
