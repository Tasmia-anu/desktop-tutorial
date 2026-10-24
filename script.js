const tasks = [
    { id: 1, title: "Complete a 90-minute morning focus block", due: "2026-10-25", progress: 0 },
    { id: 2, title: "Study one full session with my phone in another room", due: "2026-10-27", progress: 0 },
    { id: 3, title: "Do the 9:00 PM shutdown ritual three nights in a row", due: "2026-10-30", progress: 0 }
];
const MINIMUM = 66.67; // benchmark: 2 of 3 tasks
const TARGET = 100;

const fmt = d => new Date(d + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
const $ = id => document.getElementById(id);

function render() {
    $("tasks").innerHTML = tasks.map(t => {
        const done = t.progress === 100;
        return `
      <div class="p-4 rounded-lg bg-white border flex flex-col sm:flex-row sm:items-center gap-4" style="border-color:${done ? 'var(--ok)' : 'var(--line)'}">
        <button class="check-btn shrink-0 w-11 h-11 rounded-md border-2 text-xl font-bold flex items-center justify-center"
          style="border-color:${done ? 'var(--ok)' : 'var(--teal)'}; background:${done ? 'var(--ok)' : 'transparent'}; color:${done ? '#fff' : 'transparent'}"
          aria-pressed="${done}" aria-label="Mark task ${t.id} ${done ? 'not completed' : 'completed'}" onclick="toggle(${t.id})">✓</button>
        <div class="flex-1 min-w-0">
          <p class="font-semibold ${done ? 'line-through opacity-60' : ''}">${t.title}</p>
          <p class="text-sm" style="color:var(--muted)">Due ${fmt(t.due)}</p>
          <div class="h-2 rounded-full mt-2 overflow-hidden" style="background:#dbe6ec">
            <div class="bar-fill h-full" style="width:${t.progress}%; background:${done ? 'var(--ok)' : 'var(--teal)'}"></div>
          </div>
        </div>
        <div class="flex items-center gap-3 sm:justify-end">
          <span class="text-sm font-semibold w-12 text-right">${t.progress}%</span>
          <button class="step-btn px-3 py-2 rounded-md text-sm font-semibold border" style="border-color:var(--teal); color:var(--teal)" onclick="step(${t.id})" ${done ? 'disabled style="opacity:.4;border-color:var(--line);color:var(--muted)"' : ''}>+25%</button>
        </div>
      </div>`;
    }).join("");

    const completed = tasks.filter(t => t.progress === 100).length;
    const completion = Math.round(completed / tasks.length * 100);
    const average = Math.round(tasks.reduce((s, t) => s + t.progress, 0) / tasks.length);

    $("completion").textContent = completion + "%";
    $("completionNote").textContent = `${completed} of ${tasks.length} tasks done`;
    $("average").textContent = average + "%";
    $("gap").textContent = (TARGET - average) + " pts";
    $("benchFill").style.width = average + "%";
    $("benchTrack").setAttribute("aria-valuenow", average);

    let status, text, color;
    if (average >= TARGET) {
        status = "Target reached"; color = "var(--ok)";
        text = "You are at the 100% target. Nothing left to close.";
    } else if (average >= MINIMUM) {
        status = "Above the minimum goal"; color = "var(--ok)";
        text = `You are ${(average - Math.round(MINIMUM))} points above the minimum goal and ${TARGET - average} points short of the target.`;
    } else {
        status = "Below the minimum goal"; color = "#b3501f";
        text = `You are ${Math.round(MINIMUM) - average} points below the minimum goal and ${TARGET - average} points short of the target. Log some progress to catch up.`;
    }
    $("benchStatus").textContent = status;
    $("benchStatus").style.color = color;
    $("benchText").textContent = text;

    $("success").classList.toggle("hidden", completed !== tasks.length);
}

function toggle(id) {
    const t = tasks.find(x => x.id === id);
    t.progress = t.progress === 100 ? 0 : 100;
    render();
}
function step(id) {
    const t = tasks.find(x => x.id === id);
    t.progress = Math.min(100, t.progress + 25);
    render();
}
render();