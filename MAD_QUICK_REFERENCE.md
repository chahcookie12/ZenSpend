# 💰 MAD Currency - Quick Reference

## ✅ Conversion Complete

ZenSpend now displays all monetary values in **Moroccan Dirham (MAD)**.

---

## 🎯 How to Use Currency Formatter

### Import
```javascript
import { formatCurrency } from '../utils/currency'
```

### Basic Usage
```javascript
// Standard format (no decimals)
formatCurrency(1200)        // "1 200 MAD"
formatCurrency(350)         // "350 MAD"
formatCurrency(15000)       // "15 000 MAD"

// With decimals
formatCurrency(1200.50, true)   // "1 200,50 MAD"
formatCurrency(350.99, true)    // "350,99 MAD"
```

---

## 📊 Display Formats

### Standard (Whole Numbers)
**Used in:** Home page, Charts, Summaries

```javascript
<span>{formatCurrency(amount)}</span>
```

**Output:** `1 200 MAD`

---

### With Decimals
**Used in:** Money page (expenses list)

```javascript
<span>{formatCurrency(amount, true)}</span>
```

**Output:** `1 200,50 MAD`

---

### Compact (Charts)
**Used in:** Large numbers in visualizations

```javascript
import { formatCurrencyCompact } from '../utils/currency'

formatCurrencyCompact(1500)      // "1.5K MAD"
formatCurrencyCompact(1200000)   // "1.2M MAD"
```

---

## 🔢 Input Fields

### Budget/Amount Inputs

**Label Pattern:**
```javascript
<label>What would you like to spend this month? (MAD)</label>
<input type="number" placeholder="0" />
```

**Key Points:**
- ✅ No `$` symbol in input
- ✅ Mention "MAD" in label or placeholder
- ✅ Use `type="number"` for numeric input
- ✅ Simple, clean UX

---

## 🗺️ Where MAD Appears

### Home Page
- Monthly budget planned
- Total spent
- Remaining amount

### Money Page
- Monthly flow input
- Fixed expenses (with decimals)
- Variable expenses (with decimals)
- Summary section (4 amounts)

### Insights Page
- Weekly chart labels (7 days)
- Monthly chart labels (4-5 weeks)

### Pause Page
- Price input field

### Chat (Zenos)
- System prompt context
- AI responses about money

---

## 🎨 Formatting Examples

### Home Page Display
```
This month's flow
You've used 50% of what you planned for this month

2 100 MAD used     3 000 MAD planned
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Still available
1 800 MAD
```

### Money Page Summary
```
This month
Monthly flow          3 000,00 MAD
Fixed expenses        1 200,00 MAD
Variable expenses       600,00 MAD
─────────────────────────────────
Space to move         1 200,00 MAD
```

### Insights Chart
```
This week's rhythm
Mon    150 MAD  ████████░░
Tue     80 MAD  ████░░░░░░
Wed    220 MAD  ██████████
```

---

## 🤖 Zenos (Chat) Context

Zenos receives financial context in MAD:

```
Financial Context:
- Monthly income: 3000 MAD
- Spent so far: 2100 MAD
- Remaining: 900 MAD
- Recent spending: heavy
```

**Example Response:**
> "You have 900 MAD left this month. This 200 MAD purchase would use about a quarter of what remains. How essential does this feel?"

---

## 🔧 Utility Functions

### Available Functions

```javascript
// Format currency
formatCurrency(amount, showDecimals = false)

// Compact format
formatCurrencyCompact(amount)

// Parse input
parseCurrencyInput(input)

// Constants
CURRENCY_SYMBOL      // "MAD"
CURRENCY_NAME        // "Dirham Marocain"
```

---

## ✨ Best Practices

### DO ✅
- Use `formatCurrency()` for all displays
- Include "MAD" in input labels/placeholders
- Keep number inputs clean (no symbols)
- Use decimals for detailed expense lists
- Use whole numbers for summaries/charts

### DON'T ❌
- Hardcode "MAD" in components
- Use `$` symbol anywhere
- Mix formatting styles
- Show decimals in charts (too cluttered)
- Reference USD or dollars

---

## 🧪 Testing

### Visual Check
1. Open each page
2. Look for any `$` symbols → Should be none
3. Verify all amounts show "MAD"
4. Check input field labels

### Functional Check
1. Enter budget amount → Saves correctly
2. Add expense → Displays in MAD
3. View charts → Labels show MAD
4. Ask Zenos about money → Responds in MAD

---

## 📝 Quick Examples

### Adding New Currency Display

```javascript
// 1. Import formatter
import { formatCurrency } from '../utils/currency'

// 2. Use in JSX
<div className="text-sage-700">
  Total: {formatCurrency(totalAmount)}
</div>

// 3. With decimals (if needed)
<div className="text-sage-600 text-sm">
  {formatCurrency(expense.amount, true)}
</div>
```

### Creating Input Field

```javascript
<div className="space-y-2">
  <label className="text-sage-600 text-sm">
    Amount (MAD)
  </label>
  <input
    type="number"
    placeholder="0"
    className="w-full px-4 py-3 rounded-xl"
  />
</div>
```

---

## 🎯 Summary

- **Currency:** Moroccan Dirham (MAD)
- **Format:** `1 200 MAD` (space separator)
- **Decimals:** `350,50 MAD` (comma separator)
- **Utility:** `src/utils/currency.js`
- **Usage:** Import and use `formatCurrency()`

**All monetary displays are now in MAD!** 🇲🇦

