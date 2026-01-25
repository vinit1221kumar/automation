#!/bin/bash

# Daily productivity log generator
# Appends timestamped entries to daily-log.md

LOG_FILE="data/daily-log.md"
CURRENT_DATE=$(date +'%Y-%m-%d')
CURRENT_TIME=$(date +'%H:%M:%S IST')
CURRENT_DATETIME=$(date +'%Y-%m-%d %H:%M:%S IST')

# Create log file if it doesn't exist
if [ ! -f "$LOG_FILE" ]; then
    echo "# Daily Productivity Log" > "$LOG_FILE"
    echo "" >> "$LOG_FILE"
    echo "Automated tracking of daily productivity metrics and learning progress." >> "$LOG_FILE"
    echo "" >> "$LOG_FILE"
fi

# Generate productivity metrics
HOUR=$(date +'%H')
PRODUCTIVITY_SCORE=$((50 + RANDOM % 50))  # Random score between 50-100
TASKS_COMPLETED=$((1 + RANDOM % 5))       # 1-5 tasks
LEARNING_MINUTES=$((15 + RANDOM % 45))    # 15-60 minutes

# Determine session type based on time
if [ "$HOUR" -ge 4 ] && [ "$HOUR" -lt 7 ]; then
    SESSION_TYPE="Morning Focus"
    ACTIVITY="Code review and planning"
elif [ "$HOUR" -ge 7 ] && [ "$HOUR" -lt 10 ]; then
    SESSION_TYPE="Midday Development"
    ACTIVITY="Feature implementation"
elif [ "$HOUR" -ge 10 ] && [ "$HOUR" -lt 13 ]; then
    SESSION_TYPE="Afternoon Optimization"
    ACTIVITY="Performance tuning and testing"
elif [ "$HOUR" -ge 13 ] && [ "$HOUR" -lt 16 ]; then
    SESSION_TYPE="Evening Documentation"
    ACTIVITY="Documentation and knowledge sharing"
else
    SESSION_TYPE="Night Learning"
    ACTIVITY="Skill development and research"
fi

# Learning topics array
LEARNING_TOPICS=(
    "Kubernetes orchestration patterns"
    "Advanced GitHub Actions workflows"
    "Microservices architecture design"
    "CI/CD pipeline optimization"
    "Infrastructure as Code best practices"
    "Container security hardening"
    "Monitoring and observability"
    "Database performance tuning"
    "API design and versioning"
    "Cloud cost optimization"
)

# Select random learning topic
TOPIC_INDEX=$((RANDOM % ${#LEARNING_TOPICS[@]}))
LEARNING_TOPIC="${LEARNING_TOPICS[$TOPIC_INDEX]}"

# Append new entry to log
cat >> "$LOG_FILE" << EOF

## $CURRENT_DATE - $SESSION_TYPE

**Timestamp:** $CURRENT_DATETIME  
**Productivity Score:** $PRODUCTIVITY_SCORE/100  
**Tasks Completed:** $TASKS_COMPLETED  
**Learning Time:** ${LEARNING_MINUTES} minutes  
**Focus Area:** $ACTIVITY  
**Learning Topic:** $LEARNING_TOPIC  

### Session Notes
- Maintained consistent development workflow
- Applied DevOps best practices in automation
- Focused on code quality and maintainability
- Documented progress for continuous improvement

---
EOF

echo "✅ Daily log updated successfully at $CURRENT_DATETIME"
echo "📊 Productivity Score: $PRODUCTIVITY_SCORE/100"
echo "📚 Learning Topic: $LEARNING_TOPIC"