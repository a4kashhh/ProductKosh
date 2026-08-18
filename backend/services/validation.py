import re
from typing import List, Dict, Optional
from backend.config import settings
from backend.models.product import EnrichedProduct, ValidationIssue, LineageLog
from datetime import datetime


# ─────────────────────────────────────────────────────────────────────────────
#  Category-aware required fields
#  key   : substring to match against product.category_name (case-insensitive)
#  value : list of (field_label, match_keywords_any_of, helpful_action)
# ─────────────────────────────────────────────────────────────────────────────
CATEGORY_REQUIRED_FIELDS: Dict[str, List] = {
    # FMCG / Food & Beverage
    "tea":          [("Net Weight / Quantity", ["net weight", "net quantity", "quantity"], "Add pack size e.g. 500g.")],
    "dairy":        [("Net Weight / Quantity", ["net weight", "net quantity", "quantity"], "Add pack size e.g. 500g."),
                     ("Fat Content",           ["fat", "milk fat"],                        "Add declared fat % per label.")],
    "honey":        [("Net Weight / Quantity", ["net weight", "net quantity", "quantity"], "Add pack size e.g. 500g.")],
    "edible oil":   [("Net Volume",            ["net volume", "net quantity", "volume"],   "Add volume e.g. 1L."),
                     ("Smoke Point",           ["smoke point"],                            "Add smoke point in °C.")],
    "detergent":    [("Net Weight / Quantity", ["net weight", "net quantity", "quantity"], "Add pack size e.g. 1kg.")],
    "fmcg":         [("Net Weight / Quantity", ["net weight", "net quantity", "quantity"], "Add pack size.")],
    "grocery":      [("Net Weight / Quantity", ["net weight", "net quantity", "quantity"], "Add pack size.")],

    # Appliances & Electricals
    "air conditioner": [("Cooling Capacity",  ["cooling capacity", "ton", "btu"],         "Add tonnage e.g. 1.5 Ton."),
                        ("BEE Star Rating",   ["bee", "star", "iseer"],                   "Add BEE star rating.")],
    "ceiling fan":     [("Sweep Size",        ["sweep", "diameter", "size", "mm"],         "Add sweep size e.g. 1200mm."),
                        ("Air Delivery",      ["air delivery", "airflow", "m³/min"],       "Add air delivery in m³/min.")],
    "geyser":          [("Storage Capacity",  ["capacity", "liters", "litres", "l"],       "Add tank capacity e.g. 25L."),
                        ("Rated Wattage",     ["watt", "kw", "power"],                    "Add power rating in watts.")],
    "water heater":    [("Storage Capacity",  ["capacity", "liters"],                     "Add tank capacity."),
                        ("Rated Wattage",     ["watt", "kw", "power"],                   "Add power rating.")],
    "voltage stabilizer": [("Input Voltage Range", ["input", "voltage range", "v"],       "Add working input range e.g. 130V–280V."),
                           ("Output Voltage",       ["output voltage"],                   "Add regulated output voltage.")],
    "domestic water pump": [("Power Rating",  ["hp", "kw", "power"],                      "Add motor HP e.g. 1.0 HP."),
                            ("Max Flow Rate", ["flow", "lpm", "lph", "m³/h"],             "Add max flow rate.")],

    # Hardware & Building Materials
    "paint":           [("Coverage",          ["coverage", "sq.ft", "sqft", "m²"],        "Add spreading coverage e.g. 140–160 sq.ft/L."),
                        ("Finish",            ["finish", "sheen", "matte", "glossy"],     "Add finish type e.g. Matt, Sheen.")],
    "adhesive":        [("Bonding Strength",  ["strength", "kg/cm", "mpa"],               "Add bond strength."),
                        ("Net Weight",        ["net weight", "kg", "gram"],               "Add pack size.")],
    "electrical wire": [("Conductor Size",    ["sq.mm", "sqmm", "cross section"],         "Add conductor area e.g. 2.5 sq.mm."),
                        ("Voltage Grade",     ["volt", "kv", "voltage grade"],            "Add voltage rating e.g. 1100V.")],
    "pvc pipe":        [("Outer Diameter",    ["diameter", "mm", "od"],                   "Add outer diameter e.g. 110mm."),
                        ("Wall Thickness",    ["wall thickness", "thickness"],            "Add wall thickness.")],
    "water storage":   [("Capacity",          ["liter", "litre", "capacity", "l"],        "Add tank capacity e.g. 1000L."),
                        ("Material Grade",    ["hdpe", "polyethylene", "food grade"],     "Add material grade.")],
    "water tank":      [("Capacity",          ["liter", "litre", "capacity"],             "Add tank capacity."),
                        ("Material Grade",    ["hdpe", "polyethylene", "food grade"],     "Add material grade.")],

    # Industrial Valves
    "ball valve":      [("Valve Size",        ["size", "mm", "inch", "dn"],               "Add valve size range e.g. 50–300mm."),
                        ("Pressure Class",    ["pressure", "class", "ansi", "pn", "bar"], "Add pressure rating."),
                        ("Body Material",     ["material", "body", "steel", "ss"],        "Add body material e.g. A216 WCB.")],
    "butterfly valve": [("Valve Size",        ["size", "mm", "dn"],                       "Add size range."),
                        ("Pressure Class",    ["pressure", "class", "pn"],               "Add pressure class.")],
    "process valve":   [("Valve Size",        ["size", "mm", "dn"],                       "Add valve size."),
                        ("Pressure Class",    ["pressure", "class", "pn"],               "Add pressure class.")],
    "industrial process valve": [
                        ("Valve Size",        ["size", "mm", "dn"],                       "Add valve size."),
                        ("Pressure Class",    ["pressure", "class", "pn"],               "Add pressure class.")],

    # Industrial Pumps
    "industrial process pump": [
                        ("Max Flow Rate",     ["flow", "m³/h", "gpm"],                    "Add max flow rate."),
                        ("Max Head",          ["head", "meters", "bar"],                  "Add max head/pressure.")],
    "industrial centrifugal":  [
                        ("Max Flow Rate",     ["flow", "m³/h", "gpm"],                    "Add max flow rate."),
                        ("Max Head",          ["head", "meters"],                         "Add max head.")],

    # Instruments
    "transmitter":     [("Measurement Range", ["range", "bar", "pa", "°c"],               "Add measurement span."),
                        ("Output Signal",     ["output", "ma", "hart", "4-20"],           "Add output signal type.")],
    "process transmitter": [
                        ("Measurement Range", ["range", "bar"],                           "Add measurement span."),
                        ("Output Signal",     ["output", "ma", "hart"],                   "Add output signal.")],
    "flowmeter":       [("Measurement Range", ["range", "dn", "pipe size"],               "Add pipe / line size."),
                        ("Fluid Compatibility",["fluid", "liquid", "medium"],             "Add compatible fluid type.")],
    "temperature sensor": [
                        ("Temperature Range", ["range", "°c", "to"],                     "Add measurement range."),
                        ("Sensor Type",       ["thermocouple", "rtd", "pt100"],           "Add sensor type.")],
    "level instrument":[("Measurement Range", ["range", "meters", "m"],                   "Add max measurement range.")],

    # Material Handling
    "material handling":[("Lift Capacity",   ["capacity", "kg", "ton"],                   "Add rated lift capacity."),
                         ("Lift Height",     ["height", "mast", "meters"],                "Add max lift height.")],
    "forklift":         [("Lift Capacity",   ["capacity", "kg", "ton"],                   "Add rated lift capacity."),
                         ("Engine Power",    ["engine", "kw", "hp"],                      "Add engine power rating.")],
}


def _get_required_fields(cat_name: str) -> List:
    """Return the required fields list for a given category_name."""
    cat_lower = cat_name.lower()
    # Longest-match first
    for key in sorted(CATEGORY_REQUIRED_FIELDS.keys(), key=len, reverse=True):
        if key in cat_lower:
            return CATEGORY_REQUIRED_FIELDS[key]
    return []  # No mandatory fields for unrecognised categories — don't flag blindly


class ValidationEngine:
    def validate_product(self, product: EnrichedProduct) -> EnrichedProduct:
        issues: List[ValidationIssue] = []
        flagged_fields: List[str] = []
        spec_keys_lower = [k.lower() for k in product.specifications.keys()]

        # ── 1. Confidence threshold check ─────────────────────────────────────
        for field_name, attr in product.specifications.items():
            if attr.confidence_score < settings.CONFIDENCE_THRESHOLD:
                issues.append(ValidationIssue(
                    field_name=field_name,
                    issue_type="low_confidence",
                    severity="warning",
                    message=(
                        f"Field '{field_name}' confidence ({attr.confidence_score:.2f}) "
                        f"is below threshold ({settings.CONFIDENCE_THRESHOLD})."
                    ),
                    suggested_action="Cross-check with source datasheet and verify.",
                ))
                flagged_fields.append(field_name)

        # ── 2. Physical range checks ───────────────────────────────────────────
        for field_name, attr in product.specifications.items():
            val_str = str(attr.value).lower()
            num = self._extract_first_number(str(attr.value))

            if "pressure" in field_name.lower() and num is not None:
                unit = (attr.unit or "").lower()
                if "bar" in val_str or "bar" in unit or "kg/cm" in val_str:
                    if num < 0 or num > 700:
                        issues.append(ValidationIssue(
                            field_name=field_name,
                            issue_type="out_of_range",
                            severity="error",
                            message=f"Pressure {num} Bar is outside plausible range (0–700 Bar).",
                            suggested_action="Check unit conversion or decimal placement.",
                        ))
                        flagged_fields.append(field_name)

            if "temp" in field_name.lower() and num is not None:
                if num < -273 or num > 1500:
                    issues.append(ValidationIssue(
                        field_name=field_name,
                        issue_type="out_of_range",
                        severity="error",
                        message=f"Temperature {num}°C violates physical bounds (-273°C to 1500°C).",
                        suggested_action="Verify °C vs °F or check datasheet.",
                    ))
                    flagged_fields.append(field_name)

        # ── 3. Price contradiction check ───────────────────────────────────────
        if product.price_range.min_price > product.price_range.max_price:
            issues.append(ValidationIssue(
                field_name="price_range",
                issue_type="contradiction",
                severity="error",
                message=(
                    f"Min price ₹{product.price_range.min_price:,.0f} exceeds "
                    f"max price ₹{product.price_range.max_price:,.0f}."
                ),
                suggested_action="Swap min and max price boundaries.",
            ))
            flagged_fields.append("price_range")

        # ── 4. Category-aware mandatory field checks ───────────────────────────
        required_fields = _get_required_fields(product.category_name)
        for field_label, match_keywords, action in required_fields:
            present = any(
                any(kw in sk for kw in match_keywords)
                for sk in spec_keys_lower
            )
            if not present:
                issues.append(ValidationIssue(
                    field_name=field_label,
                    issue_type="missing_required",
                    severity="warning",
                    message=(
                        f"Required field '{field_label}' is missing for "
                        f"category '{product.category_name}'."
                    ),
                    suggested_action=action,
                ))
                flagged_fields.append(field_label)

        # ── 5. Currency sanity check ───────────────────────────────────────────
        if product.price_range.currency not in ("INR", "₹"):
            issues.append(ValidationIssue(
                field_name="price_range.currency",
                issue_type="wrong_currency",
                severity="warning",
                message=f"Currency is '{product.price_range.currency}', expected INR (₹).",
                suggested_action="Update currency to INR for Indian market listings.",
            ))
            flagged_fields.append("price_range.currency")

        # ── Finalise ──────────────────────────────────────────────────────────
        unique_flagged = list(dict.fromkeys(flagged_fields))
        product.flagged_fields = unique_flagged
        product.validation_issues = issues

        if unique_flagged:
            product.validation_status = "needs_review"
            product.overall_confidence = max(
                0.60, round(product.overall_confidence - 0.03 * len(unique_flagged), 2)
            )
        else:
            product.validation_status = "clean"
            product.overall_confidence = min(0.97, product.overall_confidence)

        product.lineage.append(LineageLog(
            timestamp=datetime.utcnow().isoformat(),
            stage="validation",
            action="category_aware_validation_pass",
            detail=(
                f"Category-aware validation for '{product.category_name}'. "
                f"Checked {len(required_fields)} mandatory fields. "
                f"Found {len(issues)} issue(s)."
            ),
            metadata={
                "category": product.category_name,
                "required_fields_checked": len(required_fields),
                "flagged_count": len(unique_flagged),
                "issues_count": len(issues),
            },
        ))

        return product

    def _extract_first_number(self, text: str) -> Optional[float]:
        m = re.search(r"[-+]?\d*\.?\d+", text)
        if m:
            try:
                return float(m.group(0))
            except ValueError:
                pass
        return None


validation_engine = ValidationEngine()
