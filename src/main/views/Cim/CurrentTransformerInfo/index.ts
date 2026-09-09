/**
 * CREATE TABLE "current_transformer_info" (
	"mrid"	TEXT NOT NULL,
	"accuracy_class"	TEXT,
	"accuracy_limit"	TEXT,
	"core_count"	INTEGER,
	"ct_class"	TEXT,
	"knee_point_current"	TEXT,
	"knee_point_voltage"	TEXT,
	"max_ratio"	TEXT,
	"nominal_ratio"	TEXT,
	"primary_fls_rating"	TEXT,
	"primary_ratio"	TEXT,
	"rated_current"	TEXT,
	"secondary_fls_rating"	TEXT,
	"secondary_ratio"	TEXT,
	"tertiary_fls_rating"	TEXT,
	"tertiary_ratio"	TEXT,
	"usage"	TEXT,
	PRIMARY KEY("mrid"),
	FOREIGN KEY("accuracy_limit") REFERENCES "current_flow"("mrid"),
	FOREIGN KEY("knee_point_current") REFERENCES "current_flow"("mrid"),
	FOREIGN KEY("knee_point_voltage") REFERENCES "voltage"("mrid"),
	FOREIGN KEY("max_ratio") REFERENCES "ratio"("mrid"),
	FOREIGN KEY("mrid") REFERENCES "asset_info"("mrid") on delete cascade,
	FOREIGN KEY("nominal_ratio") REFERENCES "ratio"("mrid"),
	FOREIGN KEY("primary_fls_rating") REFERENCES "current_flow"("mrid"),
	FOREIGN KEY("primary_ratio") REFERENCES "ratio"("mrid"),
	FOREIGN KEY("rated_current") REFERENCES "current_flow"("mrid"),
	FOREIGN KEY("secondary_fls_rating") REFERENCES "current_flow"("mrid"),
	FOREIGN KEY("secondary_ratio") REFERENCES "ratio"("mrid"),
	FOREIGN KEY("tertiary_fls_rating") REFERENCES "current_flow"("mrid"),
	FOREIGN KEY("tertiary_ratio") REFERENCES "ratio"("mrid")
);
 */
class CurrentTransformerInfo {
  accuracy_class: any
  accuracy_limit: any
  core_count: any
  ct_class: any
  knee_point_current: any
  knee_point_voltage: any
  max_ratio: any
  mrid: any
  nominal_ratio: any
  primary_fls_rating: any
  primary_ratio: any
  rated_current: any
  secondary_fls_rating: any
  secondary_ratio: any
  tertiary_fls_rating: any
  tertiary_ratio: any
  usage: any
  constructor() {
    this.mrid = null
    this.accuracy_class = null
    this.accuracy_limit = null
    this.core_count = null
    this.ct_class = null
    this.knee_point_current = null
    this.knee_point_voltage = null
    this.max_ratio = null
    this.nominal_ratio = null
    this.primary_fls_rating = null
    this.primary_ratio = null
    this.rated_current = null
    this.secondary_fls_rating = null
    this.secondary_ratio = null
    this.tertiary_fls_rating = null
    this.tertiary_ratio = null
    this.usage = null
  }
}

export default CurrentTransformerInfo
