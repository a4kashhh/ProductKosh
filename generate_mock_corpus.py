import os
import json

SOURCE_DOCS_DIR = "mock_corpus/source_documents"
INPUT_PRODUCTS_FILE = "mock_corpus/input_products.json"

os.makedirs(SOURCE_DOCS_DIR, exist_ok=True)

# 40 Detailed Indian Daily Use, FMCG, Electrical, Hardware & Industrial Source Specs
DOCUMENTS = {
    # FMCG & Beverages
    "DOC-001_TataTea_Gold_500g.md": """# Product Specification: Tata Tea Gold Premium Assam & Long Leaf Tea
**Brand / Manufacturer**: Tata Consumer Products Limited (India)
**Category**: FMCG - Beverages & Packaged Tea
**UNSPSC Taxonomy**: 50201712 (Tea)
**FSSAI License**: 10014031001025

## Product Specifications
- **Net Quantity**: 500 grams (Pack of 1)
- **Tea Blend**: 85% Premium Assam CTC Granules with 15% Gently Rolled Long Leaves
- **Flavor & Aroma**: Rich Amber Liquor with Intense Floral & Malty Aroma
- **Shelf Life**: 12 Months from Packaging Date
- **Storage Instructions**: Store in an airtight container in a cool, dry place
- **Ingredients**: 100% Black Tea
- **Country of Origin**: India (Assam Tea Gardens)

## Quality & Compliance
- **FSSAI Certified**: FSSAI License No. 10014031001025
- **Quality Assurance**: ISO 22000 Food Safety Management
- **Packaging Standard**: 100% Recyclable Moisture-Barrier Foil Pouch
""",

    "DOC-002_Amul_PasteurisedButter_500g.md": """# Product Specification: Amul Pasteurised Salted Butter
**Brand / Manufacturer**: Gujarat Cooperative Milk Marketing Federation (GCMMF - Amul India)
**Category**: Dairy & Packaged Foods
**UNSPSC Taxonomy**: 50131601 (Butter)
**FSSAI License**: 10012021000071

## Product Specifications
- **Net Quantity**: 500 grams Pack
- **Fat Content**: Minimum 80.0% Milk Fat
- **Moisture Content**: Maximum 16.0%
- **Salt Content**: Maximum 2.5% Common Salt
- **Refrigeration Temperature**: Store refrigerated at 4°C or below
- **Shelf Life**: 12 Months under refrigeration (-18°C)
- **Ingredients**: Milk Fat, Common Salt, Permitted Natural Color (Annatto)

## Compliance & Standards
- **FSSAI Standard**: AGMARK Certified Grade Special
- **Food Safety**: HACCP & ISO 22000 Certified Amul Dairy Plants
""",

    "DOC-003_Dabur_Honey_500g.md": """# Product Datasheet: Dabur 100% Pure Natural Honey
**Brand / Manufacturer**: Dabur India Limited
**Category**: Health & FMCG
**UNSPSC Taxonomy**: 50181905 (Honey)
**FSSAI License**: 10012011000618

## Product Specifications
- **Net Quantity**: 500 grams Squeezy Pack / Glass Jar
- **Purity Test**: 100% Pure Natural Honey - Passes Nuclear Magnetic Resonance (NMR) Test
- **Added Sugar**: 0% Added Sugar, 0% Rice Syrup / C3-C4 Adulteration
- **Energy Value**: 320 kcal per 100g
- **Shelf Life**: 18 Months from Date of Packing
- **Key Benefits**: Natural Immunity Booster, Natural Energy Source

## Compliance & Standards
- **FSSAI Standard**: FSSAI Regulations for Honey & Bee Products
- **Purity Guarantee**: NMR Tested in World-Class German Laboratories
""",

    "DOC-004_SurfExcel_EasyWash_1kg.md": """# Product Specification: Surf Excel Easy Wash Detergent Powder
**Brand / Manufacturer**: Hindustan Unilever Limited (HUL India)
**Category**: Home Care & Hygiene
**UNSPSC Taxonomy**: 47131811 (Laundry detergents)

## Product Specifications
- **Net Weight**: 1.0 kg Box / Pouch
- **Form**: Fine Blue Powder with Red Stain-Buster Micro-Granules
- **Active Ingredient**: Linear Alkylbenzene Sulfonate & Enzymes
- **pH Value**: 10.0 to 11.0 (1% Solution in Water)
- **Fragrance**: Fresh Ocean Breeze
- **Suitability**: Top Load Washing Machines & Hand Wash Bucket Wash

## Compliance & Standards
- **Environmental**: Phosphate-Free & Biodegradable Surfactants
- **Consumer Safety**: Bureau of Indian Standards IS 4955 Compliant
""",

    "DOC-005_Fortune_RefinedSunflowerOil_1L.md": """# Product Specification: Fortune Sunlite Refined Sunflower Oil
**Brand / Manufacturer**: Adani Wilmar Limited (India)
**Category**: Edible Oils & Cooking Essentials
**UNSPSC Taxonomy**: 50151513 (Sunflower oil)
**FSSAI License**: 10013021000835

## Product Specifications
- **Net Volume**: 1.0 Liter Pouch / PET Bottle
- **Fortification**: Fortified with Vitamin A (25 IU/g) & Vitamin D (4.5 IU/g)
- **Free Fatty Acids**: Maximum 0.10% (as Oleic Acid)
- **Peroxide Value**: Maximum 2.0 meq/kg
- **Smoke Point**: High Smoke Point (232°C / 450°F) for Deep Frying
- **Shelf Life**: 9 Months from Packing Date

## Compliance & Standards
- **FSSAI Mandate**: FSSAI Fortified Logo (Sampoorna Poshan)
- **AGMARK Grade**: AGMARK Certified Grade 1 Refined Oil
""",

    # Electricals & Appliances
    "DOC-006_Havells_CeilingFan_Ambrose_1200mm.md": """# Technical Datasheet: Havells Ambrose 1200mm Decorative Ceiling Fan
**Brand / Manufacturer**: Havells India Limited
**Category**: Home Appliances - Ceiling Fans
**UNSPSC Taxonomy**: 40101604 (Ceiling fans)

## Technical Specifications
- **Sweep Size / Diameter**: 1200 mm (48 inch)
- **Air Delivery**: 230 m³/min (High Air Flow)
- **Rated Speed**: 390 RPM
- **Power Consumption**: 74 Watts (High Efficiency Copper Winding Motor)
- **Voltage Input**: 220V - 240V AC 50Hz Single Phase
- **Blade Count & Material**: 3 Aluminum Aerodynamic Blades
- **Finish & Color**: Pearl White Chrome Accent / Metallic Bronze

## Compliance & Standards
- **Energy Rating**: BEE 5-Star Energy Efficiency Star Rating
- **Indian Standard**: BIS IS 374 Ceiling Fans Specification
- **Warranty**: 2 Years Manufacturer Warranty Across India
""",

    "DOC-007_Crompton_WaterPump_MiniMaster_1HP.md": """# Technical Spec: Crompton Mini Master Plus 1.0 HP Domestic Water Pump
**Brand / Manufacturer**: Crompton Greaves Consumer Electricals Limited (India)
**Category**: Domestic & Agricultural Water Pumps
**UNSPSC Taxonomy**: 40151503 (Domestic pumps)

## Technical Specifications
- **Power Rating**: 0.75 kW (1.0 HP)
- **Operating Voltage**: 180V - 240V 50Hz AC Single Phase
- **Max Flow Rate**: 3000 Liters Per Hour (50 LPM / 3.0 m³/h)
- **Head Range**: 6 meters to 36 meters (Up to 4-storey residential buildings)
- **Suction Lift**: Up to 8 meters
- **Pipe Size**: 25mm x 25mm (1" Suction x 1" Delivery)
- **Body Material**: Cast Iron Motor Body with Brass Impeller & TOP Thermal Overload Protector

## Compliance & Standards
- **Indian Standard**: BIS IS 8472 Pumps for Clear Cold Water
- **Ingress Protection**: IP44 Motor Protection Rating
- **Efficiency**: Energy Efficient IE2 Motor Winding
""",

    "DOC-008_Bajaj_Geyser_Calenta_25L.md": """# Technical Manual: Bajaj Calenta Mechanical 25L Storage Water Heater
**Brand / Manufacturer**: Bajaj Electricals Limited (India)
**Category**: Home Appliances - Geysers & Water Heaters
**UNSPSC Taxonomy**: 40101801 (Water heaters)

## Technical Specifications
- **Storage Capacity**: 25 Liters
- **Rated Wattage**: 2000 Watts (2.0 kW) Heating Element
- **Rated Pressure**: 8.0 Bar (Suitable for high-rise buildings up to 8 floors)
- **Inner Tank Coating**: Titanium Armour Technology Inner Glassline Coated Tank
- **Outer Body**: ABS Shock-Proof & Rust-Proof Outer Body
- **Temperature Control**: Adjustable Thermostat Dial (30°C to 75°C)
- **Safety Features**: 4-in-1 Multifunctional Safety Valve & Thermal Cutoff

## Compliance & Standards
- **BEE Rating**: BEE 5-Star Rated Power Savings
- **Indian Standard**: BIS IS 2082 Stationary Storage Electric Water Heaters
""",

    "DOC-009_VGuard_VoltageStabilizer_VG500.md": """# Technical Datasheet: V-Guard VG500 Voltage Stabilizer for Air Conditioner
**Brand / Manufacturer**: V-Guard Industries Limited (India)
**Category**: Electrical Protection & Power Conditioning
**UNSPSC Taxonomy**: 39121013 (Voltage regulators)

## Technical Specifications
- **Capacity**: 15 Amp / Suitable for AC up to 2.0 Ton Capacity
- **Working Input Voltage Range**: 130V to 280V AC 50Hz
- **Output Voltage**: 200V - 240V Regulated Output
- **Cabinet Material**: Flame-Retardant ABS High Impact Cabinet
- **Display**: Digital LED Input & Output Voltage Display
- **Time Delay System**: 3-Minute Smart Time Delay System (ITDS) for Compressor Safety
- **Protection**: High/Low Voltage Cut-Off & Thermal Overload Protection

## Compliance & Standards
- **Indian Standard**: BIS IS 9815 Voltage Stabilizer Standard
- **Warranty**: 3 Years Replacement Warranty Across India
""",

    "DOC-010_Voltas_InverterAC_1.5Ton_5Star.md": """# Product Specification: Voltas 1.5 Ton 5-Star Adjustable Inverter Split AC
**Brand / Manufacturer**: Voltas Limited (A Tata Enterprise)
**Category**: Air Conditioning & HVAC
**UNSPSC Taxonomy**: 40101701 (Air conditioners)

## Technical Specifications
- **Cooling Capacity**: 1.5 Ton (5100 Watts / 17400 BTU/h)
- **Adjustable Cooling Modes**: 4-in-1 Convertible Modes (20%, 50%, 75%, 100% Tonnage)
- **ISEER Energy Efficiency Ratio**: 5.00 (High Savings)
- **Refrigerant Gas**: Environmentally Friendly R32 Green Gas
- **Condenser Coil**: 100% Copper Tubes with Anti-Corrosive Blue Fins
- **Ambient Operating Temperature**: Operates efficiently up to 52°C High Heat
- **Air Filtration**: Anti-Microbial Dust Filter + PM 2.5 Air Filter

## Compliance & Standards
- **BEE Rating**: BEE 5-Star Rated Split Air Conditioner
- **Indian Standard**: BIS IS 1391 Split AC Standard
""",

    # Hardware, Paints & Construction
    "DOC-011_AsianPaints_RoyaleEmulsion_20L.md": """# Product Datasheet: Asian Paints Royale Luxury Interior Emulsion
**Brand / Manufacturer**: Asian Paints Limited (India)
**Category**: Paints, Coatings & Home Decor
**UNSPSC Taxonomy**: 31211501 (Paints)

## Technical Specifications
- **Volume**: 20 Liters Pack
- **Finish**: Smooth Luxury Sheen Finish with Teflon Surface Protector
- **Coverage**: 140 to 160 sq.ft per Liter for 2 Coats
- **Drying Time**: Surface Dry in 30 minutes, Recoatable after 4 hours
- **VOC Content**: Ultra-Low VOC (< 5 g/L) - Lead Free & Odorless
- **Washability**: Class 1 Washability - Easily Cleans Household Stains

## Compliance & Standards
- **Green Building**: Green Seal GS-11 Certified / Griha Compliant
- **Indian Standard**: BIS IS 15489 Interior Emulsion Paints
""",

    "DOC-012_Pidilite_FevicolSH_5kg.md": """# Technical Spec: Pidilite Fevicol SH Synthetic Resin Adhesive
**Brand / Manufacturer**: Pidilite Industries Limited (India)
**Category**: Adhesives & Chemicals
**UNSPSC Taxonomy**: 31201610 (Adhesives)

## Technical Specifications
- **Net Weight**: 5.0 kg Bucket
- **Chemical Base**: Polyvinyl Acetate Emulsion (PVA Resin)
- **Bonding Strength**: > 110 kg/cm² (Wood-to-Wood Handling Strength)
- **Setting Time**: 4 to 6 Hours Full Cure Time
- **Viscosity**: 250 to 350 Poise at 30°C
- **Application**: Furniture Joinery, Plywood Bonding, Laminates, Veneer Works

## Compliance & Standards
- **Indian Standard**: BIS IS 4835 Synthetic Resin Adhesives for Plywood
- **Formaldehyde Emission**: Low VOC & Eco-Friendly Formula
""",

    "DOC-013_Polycab_Wire_2.5sqmm_100m.md": """# Technical Datasheet: Polycab 2.5 sq.mm FR-LSH Copper Electric Wire
**Brand / Manufacturer**: Polycab India Limited
**Category**: Electrical Wires & Cables
**UNSPSC Taxonomy**: 39121600 (Electrical wires)

## Technical Specifications
- **Conductor Size**: 2.5 sq.mm Stranded Annealed Plain Copper
- **Length**: 100 Meters Box
- **Current Carrying Capacity**: 22 Amperes (Conduit Encased)
- **Voltage Grade**: 1100 Volts (1.1 kV)
- **Insulation Material**: Flame Retardant Low Smoke Low Halogen (FR-LSH) PVC Compound
- **Temperature Rating**: Maximum 70°C Operating Temperature

## Compliance & Standards
- **Indian Standard**: BIS IS 694 PVC Insulated Cables
- **Fire Safety**: Flame Retardant per IEC 60332-1 & Oxygen Index > 29%
""",

    "DOC-014_Finolex_PVC_Pipe_110mm_6m.md": """# Product Specification: Finolex 110mm SWR PVC Soil & Waste Pipe
**Brand / Manufacturer**: Finolex Industries Limited (India)
**Category**: Plumbing & Piping Systems
**UNSPSC Taxonomy**: 40172401 (PVC Pipes)

## Technical Specifications
- **Outer Diameter**: 110 mm (4 inch)
- **Length**: 6.0 Meters (20 Feet) Length
- **Wall Thickness**: 3.2 mm (Type B High Impact Duty)
- **Joint Type**: Ringfit Rubber Ring Socket / Solfit Solvent Cement Joint
- **Color**: Dark Grey with Blue Stripe
- **Application**: Soil, Waste & Rainwater Drainage in Residential Buildings

## Compliance & Standards
- **Indian Standard**: BIS IS 13592 Plastic Piping Systems for Soil & Waste
- **Quality Certification**: ISO 9001:2015 / BIS ISI Mark Stamped
""",

    "DOC-015_Supreme_WaterTank_1000L.md": """# Product Spec: Supreme Silvanus 1000 Liters 4-Layer Water Storage Tank
**Brand / Manufacturer**: The Supreme Industries Limited (India)
**Category**: Plumbing & Storage Tanks
**UNSPSC Taxonomy**: 24111808 (Water tanks)

## Technical Specifications
- **Capacity**: 1000 Liters
- **Layer Construction**: 4-Layer UV Stabilized Polyethylene Construction
- **Color**: Extra White Outer Layer with Antibacterial Inner Layer
- **Diameter & Height**: 1100 mm Diameter x 1280 mm Overall Height
- **Manhole Size**: 400 mm Threaded Top Lid with Air Vent
- **Food Grade Rating**: 100% Virgin Food Grade HDPE Material

## Compliance & Standards
- **Indian Standard**: BIS IS 12701 Rotomoulded Polyethylene Water Tanks
- **Health Rating**: US FDA 21 CFR 177 Compliant Food Contact Grade
""",

    # Industrial & Heavy Equipment (L&T, Kirloskar, Forbes Marshall, BHEL, ABB, Godrej)
    "DOC-016_LTValves_BallValve_V200.md": """# Technical Datasheet: L&T Valves Severe Service Ball Valve
**Manufacturer**: L&T Valves Limited (Larsen & Toubro)
**Category**: Industrial Valves
**UNSPSC Taxonomy**: 40141607 (Ball valves)

## Technical Specifications
- **Valve Size**: 50 mm to 300 mm (2 inch to 12 inch)
- **Pressure Class**: ANSI Class 150, 300, 600, 900 (PN 20 to PN 150)
- **Max Operating Pressure**: 258 Bar (3750 PSI / 263 kg/cm²)
- **Operating Temp**: -29°C to 538°C
- **Body Material**: Cast Carbon Steel IS 210 / ASTM A216 WCB / SS316
- **Seat Type**: Metal-Seated with Stellite 6 Hardfacing

## Compliance & Standards
- **Indian Standards**: BIS IS 778 / IBR 1950 Certified
- **PESO Approval**: PESO Approved for Hazardous Hydrocarbon Service
""",

    "DOC-017_Kirloskar_Centrifugal_CP80.md": """# Product Specification: Kirloskar CP80 End-Suction Process Pump
**Manufacturer**: Kirloskar Brothers Limited (KBL India)
**Category**: Industrial Pumps
**UNSPSC Taxonomy**: 40151503 (Centrifugal pumps)

## Technical Specifications
- **Max Flow Rate**: 193 m³/h (850 GPM)
- **Max Head**: 97.5 meters (320 ft / 9.5 Bar)
- **Motor Rating**: 11 kW to 55 kW (15 HP to 75 HP) 415V 3-Phase
- **Impeller**: Enclosed SS 316L Precision Cast

## Compliance & Standards
- **Indian Standard**: BIS IS 5120 / IS 1520 / IBR Approved
""",

    "DOC-018_ForbesMarshall_PressureTransmitter_PT9000.md": """# Engineering Specification: Forbes Marshall PT9000 Smart Pressure Transmitter
**Manufacturer**: Forbes Marshall India
**Category**: Process Instrumentation
**UNSPSC Taxonomy**: 41112404 (Pressure transmitters)

## Technical Specifications
- **Pressure Range**: 0.1 Bar to 400 Bar
- **Accuracy**: ±0.04% of URL
- **Output Signal**: 4-20 mA DC with HART 7 Protocol
- **Wetted Material**: Hastelloy C-276 / 316L SS

## Compliance & Standards
- **PESO Approval**: PESO / CCOE Flameproof (Ex d IIC T6) / DGMS Approved
""",

    "DOC-019_KSBPumps_Multistage_MP120.md": """# Product Specification: KSB MP120 High-Pressure Boiler Feed Multistage Pump
**Manufacturer**: KSB Pumps Limited India
**Category**: Industrial Pumps
**UNSPSC Taxonomy**: 40151503 (Centrifugal pumps)

## Technical Specifications
- **Max Flow Rate**: 79.5 m³/h
- **Max Pressure**: 40 Bar (400m Head)
- **Motor Power**: 18.5 kW to 110 kW (25 HP to 150 HP)

## Compliance & Standards
- **Boiler Compliance**: IBR (Indian Boiler Regulations) 1950 Certified
""",

    "DOC-020_Godrej_MaterialHandling_Forklift_3Ton.md": """# Technical Datasheet: Godrej GX 300D 3.0 Ton Diesel Counterbalance Forklift
**Manufacturer**: Godrej & Boyce Manufacturing Company Limited (India)
**Category**: Material Handling & Industrial Equipment
**UNSPSC Taxonomy**: 24101601 (Forklifts)

## Technical Specifications
- **Nominal Lift Capacity**: 3000 kg (3.0 Tons) at 500 mm Load Center
- **Max Lift Height**: 3.3 Meters to 6.0 Meters (Duplex / Triplex Mast)
- **Engine Power**: Simpson S433 4-Cylinder Industrial Diesel Engine (44 kW / 59 HP)
- **Transmission**: Automatic Hydrodynamic Powershift Transmission (1 Forward / 1 Reverse)
- **Travel Speed**: 19 km/h (Loaded)
- **Tyre Type**: Solid Rubber Puncture-Proof Tyres

## Compliance & Standards
- **Emission Norms**: Bharat Stage CEV IV / BS-IV Compliant
- **Indian Standard**: BIS IS 4660 Hydraulic Powered Industrial Trucks
"""
}

def generate():
    print(f"Writing {len(DOCUMENTS)} Indian daily-use & industrial source documents to {SOURCE_DOCS_DIR}...")
    for filename, content in DOCUMENTS.items():
        with open(os.path.join(SOURCE_DOCS_DIR, filename), "w", encoding="utf-8") as f:
            f.write(content.strip())
    
    print("Generating 200 minimal Indian product inputs...")
    base_templates = [
        # FMCG & Household
        {"name": "Tata Tea Gold Premium Assam 500g", "known": {"brand": "Tata Consumer Products"}},
        {"name": "Amul Pasteurised Salted Butter 500g", "known": {"brand": "Amul India"}},
        {"name": "Dabur 100% Pure Natural Honey 500g", "known": {"brand": "Dabur India"}},
        {"name": "Surf Excel Easy Wash Detergent Powder 1kg", "known": {"brand": "Hindustan Unilever"}},
        {"name": "Fortune Sunlite Refined Sunflower Oil 1L", "known": {"brand": "Adani Wilmar"}},

        # Electricals & Home Appliances
        {"name": "Havells Ambrose 1200mm Ceiling Fan Pearl White", "known": {"brand": "Havells India"}},
        {"name": "Crompton Mini Master Plus 1.0 HP Water Pump", "known": {"brand": "Crompton Greaves"}},
        {"name": "Bajaj Calenta 25L Storage Geyser Water Heater", "known": {"brand": "Bajaj Electricals"}},
        {"name": "V-Guard VG500 Voltage Stabilizer for 1.5 Ton AC", "known": {"brand": "V-Guard Industries"}},
        {"name": "Voltas 1.5 Ton 5-Star Inverter Split AC R32", "known": {"brand": "Voltas (A Tata Enterprise)"}},

        # Hardware & Construction
        {"name": "Asian Paints Royale Emulsion White 20L", "known": {"brand": "Asian Paints"}},
        {"name": "Pidilite Fevicol SH Wood Adhesive 5kg Bucket", "known": {"brand": "Pidilite Industries"}},
        {"name": "Polycab 2.5 sq.mm FR-LSH Copper Wire 100m", "known": {"brand": "Polycab India"}},
        {"name": "Finolex 110mm PVC SWR Soil Pipe 6m", "known": {"brand": "Finolex Industries"}},
        {"name": "Supreme Silvanus 1000L 4-Layer Water Tank", "known": {"brand": "Supreme Industries"}},

        # Industrial Equipment
        {"name": "L&T Valves V200 Ball Valve 50mm ANSI 300", "known": {"brand": "L&T Valves"}},
        {"name": "Kirloskar CP80 Centrifugal Process Pump 15HP", "known": {"brand": "Kirloskar Brothers Limited"}},
        {"name": "Forbes Marshall PT9000 Smart Pressure Transmitter", "known": {"brand": "Forbes Marshall India"}},
        {"name": "KSB MP120 Boiler Feed Multistage Pump 40 Bar", "known": {"brand": "KSB Pumps India"}},
        {"name": "Godrej GX 300D 3 Ton Diesel Forklift", "known": {"brand": "Godrej & Boyce"}}
    ]

    products = []
    idx = 1
    # Expand to 200 items by generating realistic batch variations
    for i in range(200):
        base = base_templates[i % len(base_templates)]
        prod_id = f"PROD-{idx:03d}"
        suffix = f" (Lot #{100+i})" if i >= len(base_templates) else ""
        product = {
            "id": prod_id,
            "name": f"{base['name']}{suffix}",
            "category_hint": "Indian Consumer & Industrial Product",
            "known_attributes": base["known"].copy()
        }
        products.append(product)
        idx += 1

    with open(INPUT_PRODUCTS_FILE, "w", encoding="utf-8") as f:
        json.dump(products, f, indent=2)
    print(f"Saved {len(products)} Indian product inputs to {INPUT_PRODUCTS_FILE}")

if __name__ == "__main__":
    generate()
