# 💰 Tax Savings Advisor

A comprehensive, browser-based US federal income tax savings calculator and advisor for **Tax Year 2024**. Covers every major deduction, credit, and planning strategy. 100% private — no data ever leaves your browser.

## Features

- **W-2 and Multi-Source Income** — wages, self-employment, rental, capital gains, dividends
- **Deduction Optimizer** — automatically picks Standard vs. Itemized and explains why
- **All Major Credits** — Child Tax Credit, Childcare, American Opportunity, EV Credit, Energy Credits, Adoption
- **Above-the-Line Deductions** — 401(k), IRA, SEP-IRA, HSA, FSA, student loan interest, home office, SE health insurance
- **Itemized Deductions** — mortgage interest, SALT, charitable giving, medical expenses
- **Untapped Savings** — identifies every savings opportunity you're NOT yet using
- **Next Year Action Plan** — concrete steps with deadlines to reduce next year's bill
- **Tax Bracket Breakdown** — visual bracket-by-bracket analysis
- **2024 & 2025 Tax Laws** — supports both years with accurate brackets and limits
- **Fully Responsive** — works on desktop, tablet, and mobile
- **Zero Dependencies** — pure HTML + CSS + JS, no build step needed

---

## Deploy to GitHub Pages (5 minutes)

### Step 1 — Create a GitHub Repository

1. Go to [github.com](https://github.com) → **New Repository**
2. Name it `tax-savings-advisor` (or any name you like)
3. Set visibility to **Public** (required for free GitHub Pages)
4. Click **Create Repository**

### Step 2 — Push the Code

```bash
cd tax-savings-app

git init
git add .
git commit -m "Initial commit: Tax Savings Advisor"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tax-savings-advisor.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### Step 3 — Enable GitHub Pages

1. In your repository, go to **Settings** → **Pages** (left sidebar)
2. Under **Source**, select **Deploy from a branch**
3. Choose **main** branch, **/ (root)** folder
4. Click **Save**

### Step 4 — Access Your App

After ~1–2 minutes, your app will be live at:

```
https://YOUR_USERNAME.github.io/tax-savings-advisor/
```

---

## Local Development

No build step or server required. Just open the file:

```bash
open index.html
# or on Linux:
xdg-open index.html
```

Or serve locally with Python:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

---

## Tax Data Covered (2024)

| Category | Details |
|---|---|
| Filing Statuses | Single, MFJ, MFS, Head of Household |
| Tax Brackets | 10% – 37% (2024 & 2025 IRS rates) |
| Standard Deduction | $14,600 single / $29,200 MFJ |
| 401(k) Limit | $23,000 ($30,500 age 50+) |
| IRA Limit | $7,000 ($8,000 age 50+) |
| SEP-IRA | Up to $69,000 or 25% net SE income |
| HSA | $4,150 self / $8,300 family |
| SALT Cap | $10,000 |
| Child Tax Credit | $2,000 per child under 17 |
| EV Tax Credit | Up to $7,500 |
| Energy Credit | 30% of qualifying improvements |
| Student Loan Interest | Up to $2,500 |
| LTCG Rates | 0% / 15% / 20% |

---

## Disclaimer

This tool provides **general educational estimates only** and is **not tax advice**. Tax laws are complex and individual situations vary significantly. Always consult a licensed CPA or tax professional before making financial decisions. This app does not store, transmit, or share any data.

---

## License

MIT License — free to use, modify, and share.
