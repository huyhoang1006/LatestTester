/**
 * CREATE TABLE "ct_tap_info" (
	"mrid"	TEXT NOT NULL,
	"tap_name"	TEXT,
	"ipn"	TEXT,
	"isn"	TEXT,
	"in_use"	TEXT,
	"rated_burden"	TEXT,
	"burden"	TEXT,
	"extended_burden"	TEXT,
	"burden_power_factor"	TEXT,
	"operating_burden"	TEXT,
	"operating_burden_power_factor"	TEXT,
	"ct_core_info_id"	TEXT,
	"type"	TEXT,
	PRIMARY KEY("mrid"),
	FOREIGN KEY("burden") REFERENCES "apparent_power"("mrid"),
	FOREIGN KEY("ct_core_info_id") REFERENCES "ct_core_info"("mrid"),
	FOREIGN KEY("ipn") REFERENCES "current_flow"("mrid"),
	FOREIGN KEY("isn") REFERENCES "current_flow"("mrid"),
	FOREIGN KEY("operating_burden") REFERENCES "apparent_power"("mrid"),
	FOREIGN KEY("rated_burden") REFERENCES "apparent_power"("mrid")
);
 */

class CtTapInfo {
  burden: any
  burden_power_factor: any
  ct_core_info_id: any
  extended_burden: any
  in_use: any
  ipn: any
  isn: any
  mrid: any
  operating_burden: any
  operating_burden_power_factor: any
  rated_burden: any
  tap_name: any
  type: any
  constructor() {
    this.mrid = null
    this.tap_name = null
    this.ipn = null
    this.isn = null
    this.in_use = null
    this.rated_burden = null
    this.burden = null
    this.extended_burden = null
    this.burden_power_factor = null
    this.operating_burden = null
    this.operating_burden_power_factor = null
    this.ct_core_info_id = null
    this.type = null
  }
}

export default CtTapInfo
