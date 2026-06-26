import WireInfo from '../WireInfo';

class CableInfo extends WireInfo {
    construction_kind: any
    diameter_over_core: any
    diameter_over_insulation: any
    diameter_over_jacket: any
    diameter_over_screen: any
    is_strand_fill: any
    nominal_temperature: any
    outer_jacket_kind: any
    sheath_as_neutral: any
    shield_material: any
    constructor() {
        super();

        // Thuộc tính riêng của CableInfo
        this.construction_kind = null;       // CableConstructionKind
        this.diameter_over_core = null;      // Length
        this.diameter_over_insulation = null;// Length
        this.diameter_over_jacket = null;    // Length
        this.diameter_over_screen = null;    // Length
        this.is_strand_fill = null;          // Boolean
        this.nominal_temperature = null;     // Temperature
        this.outer_jacket_kind = null;       // CableOuterJacketKind
        this.sheath_as_neutral = null;       // Boolean
        this.shield_material = null;         // CableShieldMaterialKind

        // Các trường WireInfo đã có từ lớp cha (core_radius, r_dc, strand_count, …)
        // Các trường AssetInfo, IdentifiedObject cũng đã có từ lớp cha
    }
}

export default CableInfo;
