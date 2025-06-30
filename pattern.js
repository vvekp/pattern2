const { execSync } = require("child_process");

const matrix = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1], // Sunday
  [1, 0, 1, 1, 1, 1, 1, 0, 1], // Monday
  [1, 0, 1, 1, 1, 1, 1, 0, 1], // Tuesday
  [1, 1, 1, 1, 1, 1, 1, 1, 1], // Wednesday
  [1, 1, 1, 0, 0, 0, 1, 1, 1], // Thursday
  [1, 1, 1, 1, 1, 1, 1, 1, 1], // Friday
  [1, 1, 1, 1, 1, 1, 1, 1, 1], // Saturday
];

// Set your starting date (must be a Sunday)
const startDate = new Date("2024-01-07"); // YYYY-MM-DD, should be a Sunday

let count = 0;

matrix.forEach((row, day) => {
  row.forEach((value, week) => {
    if (value === 1) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + week * 7 + day); // day offset from Sunday

      const formattedDate = date.toISOString().split("T")[0];

      const commitCommand = `
        export GIT_AUTHOR_DATE="${formattedDate}T12:00:00" &&
        export GIT_COMMITTER_DATE="${formattedDate}T12:00:00" &&
        echo "commit ${count}" >> dummy.txt &&
        git add dummy.txt &&
        git commit -m "Commit ${count} on ${formattedDate}" > /dev/null
      `;

      try {
        execSync(commitCommand, { shell: "/bin/bash" });
        console.log(`✅ Committed on ${formattedDate}`);
        count++;
      } catch (err) {
        console.error(`❌ Failed on ${formattedDate}`, err);
      }
    }
  });
});

