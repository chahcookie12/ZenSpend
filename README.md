# ZenSpend

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will run at `http://localhost:5173`


The key is handled internally - users never see or enter it. This is a prototype-level integration suitable for hackathons.

## Project Structure

```
ZenSpend2/
├── src/
│   ├── components/
│   │   ├── BottomNav.jsx       # Bottom navigation
│   │   └── BreathingExercise.jsx # Meditation component
│   ├── pages/
│   │   ├── Home.jsx            # Emotional check-in
│   │   ├── Expenses.jsx        # Expense tracking
│   │   ├── Pause.jsx           # Reflection ritual
│   │   ├── Insights.jsx        # Journal-like insights
│   │   └── Chat.jsx            # AI companion
│   ├── utils/
│   │   └── storage.js          # LocalStorage utilities
│   ├── App.jsx                 # Main app with routing
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── tailwind.config.js         # Custom warm color system
├── package.json
└── vite.config.js
```

## Design Philosophy

### What makes ZenSpend different?

**Traditional finance apps:**
- Show graphs and charts first
- Use red for overspending
- Create urgency and pressure
- Focus on optimization

**ZenSpend:**
- Emotional check-in comes first
- Uses warm, calming colors
- Creates space and pause
- Focuses on awareness and peace

### Target Experience

> "Using ZenSpend should feel like sitting with a non-judgmental friend who helps you reflect on your relationship with money, not like checking a budget dashboard."

## Development Notes

### Hard Constraints
- ✅ React + Tailwind only
- ✅ Local state + localStorage only
- ✅ No backend
- ✅ No bank integrations
- ✅ No complex analytics
- ✅ Mobile-first design

### Mobile Navigation
- Bottom navigation bar (5 items)
- Gesture-aware page transitions
- Horizontal swipe between sections
- Smooth, intentional animations

### Data Storage
All data is stored locally in browser localStorage:
- Expenses
- Check-ins (mood tracking)
- Reflections (pause decisions)
- Chat history
- Settings (API key)

## Future Enhancements

Potential additions that maintain the calm philosophy:

- [ ] Export reflections as a journal
- [ ] Weekly gentle reminders
- [ ] More breathing exercises
- [ ] Gratitude journaling
- [ ] Values-based spending tracking
- [ ] Custom monthly "intentions" vs budgets

## License

This is a hackathon MVP / prototype.

## Acknowledgments

Inspired by:
- **Headspace** - For calm, intentional UX
- **Calm** - For soothing visual design
- **Finimize** - For approachable financial content
- The mindfulness and financial therapy communities

---

**Remember:** This is not a financial advisor. It's a space to pause, reflect, and be gentle with yourself around money.

*"You're allowed to pause."*

=======
financial wellbeing app
>>>>>>> cc8ec1284b42efe0d9bf62ebb37fa14a15947207
# ZenSpend
