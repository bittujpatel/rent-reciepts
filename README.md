# Rent Intimation Receipt Generator

This is a static web application designed to generate professional rent intimation receipts for property managers, focusing on transparency and clarity for water meter usage calculations. The app is inspired by the Cred NeoPOP design language, offering a visually appealing, paper-style receipt with a dark-themed user interface.

## Features

- **Building and Room Selection:** Choose from buildings A, B, C, or D, and select room numbers such as GF1, GF2, 101, 102, 201, etc.
- **Water Meter Configuration:** Supports up to two meters per room, with options for regular (×1) and multiplier (×10) meter types.
- **Detailed Water Usage Calculations:** Displays previous and current meter readings, calculates consumption, and applies the correct multiplier for each meter.
- **Additional Charges:** Add extra charges (WiFi, current bill, old balance, water cans, etc.) as needed.
- **Dynamic Month/Year Selection:** Automatically sets the current month and year as default.
- **Optimized Print Layout:** Generates receipts that fit on a single A4/Letter page with large, clear text.
- **No Data Storage:** All processing happens in the browser; no data is stored or sent to a server.
- **Single Print Button:** One-click printing for ease of use.

## How to Use

1. **Select Building and Room**
   - From the dropdown menus, select the building (A, B, C, or D) and the room number.

2. **Set Month and Year**
   - The application defaults to the current month and year. You can change this if needed.

3. **Enter Rent Amount**
   - Input the monthly rent for the selected room.

4. **Configure Water Meters**
   - Enable up to two meters per room.
   - For each meter, select the type (Kitchen, Bathroom, or All), set the unit type (Regular or ×10), and enter the previous and current readings.
   - The app automatically calculates and displays the usage and total liters for each meter.

5. **Add Additional Charges**
   - Use the "Add Charge" button to include any extra charges (WiFi, bills, etc.).
   - Enter the charge name and amount.

6. **Preview Receipt**
   - The receipt preview updates in real time as you enter data.
   - The receipt displays detailed water meter calculations, showing how each meter’s usage is computed.

7. **Print Receipt**
   - Click the "Print" button to generate a print-friendly version of the receipt.
   - The receipt is optimized for a single page and features large, clear text for easy reading.

## Example Water Meter Calculation

```
Meter 1: Kitchen (Regular)
Previous Reading: 1500
Current Reading: 1680
Usage: 1680 - 1500 = 180 liters

Meter 2: Bathroom (×10 Multiplier)
Previous Reading: 250
Current Reading: 270
Raw Usage: 270 - 250 = 20
Final Usage: 20 × 10 = 200 liters

Total Water Usage: 380 liters
Water Charges: ₹76.00 (380 × ₹0.20)
```

## Technical Details

- **Design:** Inspired by Cred NeoPOP, with a dark-themed, paper-style receipt.
- **No Backend:** All processing is done client-side; no data is stored or transmitted.
- **Browser Compatibility:** Works on all modern browsers.
- **Print Optimization:** Receipts are formatted for a single page with large, clear text.

## Privacy and Security

- **No Data Storage:** All information stays on your device.
- **No Server Processing:** No personal or sensitive data is sent to any server.

## Support

For issues or feature requests, please open an issue on the repository.

---

**Note:** This application is intended for generating rent intimation receipts, not payment receipts. It does not include landlord, tenant, or property details, payment methods, signatures, or revenue stamps.

---
