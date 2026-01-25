#!/usr/bin/env node

/**
 * Weekly Productivity Statistics Updater
 * Processes git history and daily logs to generate comprehensive stats
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const STATS_FILE = 'data/stats.json';
const LOG_FILE = 'data/daily-log.md';

/**
 * Get current week information
 */
function getCurrentWeekInfo() {
    const now = new Date();
    const year = now.getFullYear();
    const week = getWeekNumber(now);
    return { year, week, date: now.toISOString().split('T')[0] };
}

/**
 * Calculate week number
 */
function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Get git statistics for the past week
 */
function getGitStats() {
    try {
        // Get commits from last 7 days
        const commitCount = execSync(
            'git rev-list --count --since="7 days ago" HEAD',
            { encoding: 'utf8' }
        ).trim();

        // Get files changed in last 7 days
        const filesChanged = execSync(
            'git diff --name-only --since="7 days ago" HEAD~$(git rev-list --count --since="7 days ago" HEAD) HEAD',
            { encoding: 'utf8' }
        ).split('\n').filter(line => line.trim()).length;

        // Get total lines added/removed
        const diffStats = execSync(
            'git diff --shortstat --since="7 days ago" HEAD~$(git rev-list --count --since="7 days ago" HEAD) HEAD',
            { encoding: 'utf8' }
        ).trim();

        return {
            commits: parseInt(commitCount) || 0,
            filesChanged: filesChanged || 0,
            diffStats: diffStats || 'No changes'
        };
    } catch (error) {
        console.warn('Warning: Could not fetch git stats:', error.message);
        return {
            commits: 0,
            filesChanged: 0,
            diffStats: 'No changes'
        };
    }
}

/**
 * Parse daily log for productivity metrics
 */
function parseProductivityMetrics() {
    if (!fs.existsSync(LOG_FILE)) {
        return {
            averageProductivity: 0,
            totalTasks: 0,
            totalLearningTime: 0,
            sessionCount: 0
        };
    }

    const logContent = fs.readFileSync(LOG_FILE, 'utf8');
    const productivityScores = [];
    const tasks = [];
    const learningTimes = [];
    
    // Extract metrics using regex
    const scoreMatches = logContent.match(/\*\*Productivity Score:\*\* (\d+)\/100/g) || [];
    const taskMatches = logContent.match(/\*\*Tasks Completed:\*\* (\d+)/g) || [];
    const timeMatches = logContent.match(/\*\*Learning Time:\*\* (\d+) minutes/g) || [];

    scoreMatches.forEach(match => {
        const score = parseInt(match.match(/(\d+)\/100/)[1]);
        productivityScores.push(score);
    });

    taskMatches.forEach(match => {
        const taskCount = parseInt(match.match(/(\d+)/)[1]);
        tasks.push(taskCount);
    });

    timeMatches.forEach(match => {
        const minutes = parseInt(match.match(/(\d+) minutes/)[1]);
        learningTimes.push(minutes);
    });

    return {
        averageProductivity: productivityScores.length > 0 
            ? Math.round(productivityScores.reduce((a, b) => a + b, 0) / productivityScores.length)
            : 0,
        totalTasks: tasks.reduce((a, b) => a + b, 0),
        totalLearningTime: learningTimes.reduce((a, b) => a + b, 0),
        sessionCount: productivityScores.length
    };
}

/**
 * Load existing stats or create new structure
 */
function loadExistingStats() {
    if (!fs.existsSync(STATS_FILE)) {
        return {
            metadata: {
                created: new Date().toISOString(),
                lastUpdated: null,
                totalWeeks: 0
            },
            weeks: []
        };
    }

    try {
        return JSON.parse(fs.readFileSync(STATS_FILE, 'utf8'));
    } catch (error) {
        console.warn('Warning: Could not parse existing stats, creating new file');
        return {
            metadata: {
                created: new Date().toISOString(),
                lastUpdated: null,
                totalWeeks: 0
            },
            weeks: []
        };
    }
}

/**
 * Calculate trends and insights
 */
function calculateTrends(weeks) {
    if (weeks.length < 2) return null;

    const recent = weeks.slice(-2);
    const [previous, current] = recent;

    return {
        productivityTrend: current.productivity.average - previous.productivity.average,
        commitTrend: current.git.commits - previous.git.commits,
        learningTrend: current.productivity.totalLearningTime - previous.productivity.totalLearningTime,
        consistencyScore: Math.min(100, (current.productivity.sessionCount / 35) * 100) // 35 = 5 sessions * 7 days
    };
}

/**
 * Main execution
 */
function main() {
    console.log('🔄 Updating weekly productivity statistics...');

    const weekInfo = getCurrentWeekInfo();
    const gitStats = getGitStats();
    const productivityMetrics = parseProductivityMetrics();
    const existingStats = loadExistingStats();

    // Create new week entry
    const newWeekEntry = {
        week: weekInfo.week,
        year: weekInfo.year,
        date: weekInfo.date,
        git: gitStats,
        productivity: productivityMetrics,
        goals: {
            targetProductivity: 80,
            targetCommits: 35,
            targetLearningHours: 5,
            achieved: {
                productivity: productivityMetrics.averageProductivity >= 80,
                commits: gitStats.commits >= 35,
                learning: (productivityMetrics.totalLearningTime / 60) >= 5
            }
        }
    };

    // Update stats structure
    existingStats.weeks.push(newWeekEntry);
    existingStats.metadata.lastUpdated = new Date().toISOString();
    existingStats.metadata.totalWeeks = existingStats.weeks.length;

    // Calculate trends
    const trends = calculateTrends(existingStats.weeks);
    if (trends) {
        existingStats.trends = trends;
    }

    // Add summary statistics
    existingStats.summary = {
        totalCommits: existingStats.weeks.reduce((sum, week) => sum + week.git.commits, 0),
        averageProductivity: Math.round(
            existingStats.weeks.reduce((sum, week) => sum + week.productivity.average, 0) / existingStats.weeks.length
        ),
        totalLearningHours: Math.round(
            existingStats.weeks.reduce((sum, week) => sum + week.productivity.totalLearningTime, 0) / 60
        ),
        goalsAchieved: existingStats.weeks.filter(week => 
            week.goals.achieved.productivity && 
            week.goals.achieved.commits && 
            week.goals.achieved.learning
        ).length
    };

    // Write updated stats
    fs.writeFileSync(STATS_FILE, JSON.stringify(existingStats, null, 2));

    console.log('✅ Weekly statistics updated successfully!');
    console.log(`📊 Week ${weekInfo.week}, ${weekInfo.year} Summary:`);
    console.log(`   • Commits: ${gitStats.commits}`);
    console.log(`   • Average Productivity: ${productivityMetrics.averageProductivity}/100`);
    console.log(`   • Learning Time: ${Math.round(productivityMetrics.totalLearningTime / 60)}h`);
    console.log(`   • Sessions: ${productivityMetrics.sessionCount}`);
    
    if (trends) {
        console.log(`📈 Trends:`);
        console.log(`   • Productivity: ${trends.productivityTrend > 0 ? '+' : ''}${trends.productivityTrend}`);
        console.log(`   • Commits: ${trends.commitTrend > 0 ? '+' : ''}${trends.commitTrend}`);
        console.log(`   • Consistency: ${Math.round(trends.consistencyScore)}%`);
    }
}

// Execute if run directly
if (require.main === module) {
    main();
}

module.exports = { main, getCurrentWeekInfo, getGitStats, parseProductivityMetrics };