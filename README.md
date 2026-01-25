# Automated Productivity Tracking System

A professional GitHub Actions automation project demonstrating scheduled workflows, data processing, and continuous integration practices.

## 🎯 Purpose

This repository showcases automated productivity tracking using GitHub Actions with cron schedules. It generates meaningful commits through scheduled workflows that maintain daily logs and weekly statistics - perfect for demonstrating DevOps automation skills in interviews.

## 🏗️ Architecture

```
├── .github/workflows/
│   ├── daily.yml          # 5 daily cron jobs (IST-optimized)
│   └── weekly.yml         # Weekly statistics aggregation
├── data/
│   ├── daily-log.md       # Timestamped productivity logs
│   └── stats.json         # Weekly productivity metrics
├── scripts/
│   ├── generate_log.sh    # Bash script for daily log updates
│   └── update_stats.js    # Node.js script for statistics
└── README.md
```

## 🔧 Tech Stack

- **GitHub Actions**: Workflow automation and scheduling
- **Bash**: Shell scripting for log generation
- **Node.js**: Statistics processing and JSON manipulation
- **Cron**: Time-based job scheduling
- **Git**: Automated version control

## ⚙️ Workflow Details

### Daily Workflow (`daily.yml`)
- **Schedule**: 5 times daily at IST-friendly hours (9:30, 12:30, 15:30, 18:30, 21:30)
- **Purpose**: Appends timestamped productivity logs
- **Commits**: ~5 meaningful commits per day
- **Actions**: Checkout, run bash script, commit changes

### Weekly Workflow (`weekly.yml`)
- **Schedule**: Every Sunday at 23:00 IST
- **Purpose**: Aggregates weekly productivity statistics
- **Actions**: Checkout, setup Node.js, process data, commit results

## 🚀 Features

- **Zero External Dependencies**: Runs entirely on GitHub infrastructure
- **Production-Ready Code**: Clean, maintainable, and well-documented
- **Interview-Friendly**: Easy to explain architecture and implementation
- **Meaningful Commits**: No fake activity - all commits serve a purpose
- **IST Timezone Optimized**: Schedules aligned with Indian Standard Time

## 📊 Sample Output

Daily logs include:
- Timestamp and date
- Productivity metrics
- Learning notes
- Task completion status

Weekly stats track:
- Total commits
- Active days
- Productivity trends
- Goal achievement rates

## 🔍 Interview Talking Points

1. **Cron Scheduling**: Demonstrates understanding of time-based automation
2. **Multi-Language Integration**: Bash and Node.js working together
3. **Git Automation**: Programmatic version control operations
4. **Data Processing**: JSON manipulation and log aggregation
5. **CI/CD Practices**: Automated testing and deployment concepts

## 🛠️ Local Development

```bash
# Test daily log generation
./scripts/generate_log.sh

# Test weekly stats update
node scripts/update_stats.js

# Verify workflow syntax
gh workflow list
```

## 📈 Metrics

This automation generates approximately:
- 35 commits per week (5 daily + 1 weekly)
- 1,800+ commits per year
- Consistent contribution graph activity
- Meaningful commit history for portfolio demonstration

---

*This project demonstrates professional DevOps automation practices suitable for senior backend/DevOps engineer interviews.*