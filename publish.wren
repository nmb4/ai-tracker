import "wrun/pipeline" for Pipeline
import "wrun/process" for Process
import "wrun/file" for File
import "wrun/args" for Args
import "wrun/print" for Log

// Parse arguments for --gen-readme flag and optional repo name
var genReadme = false
var repoName = null

for (i in 0...Args.count()) {
  var arg = Args.get(i)
  if (arg == "--gen-readme") {
    genReadme = true
  } else if (!arg.startsWith("--")) {
    repoName = arg
  }
}

if (repoName == null) {
  repoName = Process.cwd().split("/")[-1]
}

var domain = "%(repoName).stardive.live"

Log.addLevel("deploy", "blue")
Log.addLevel("readme", "magenta")

// Validate git repository
if (!File.isDirectory(".git")) {
  Log.error("Not a git repository.")
  Process.exit(1)
}

Log.info("Starting deployment pipeline", {"project": repoName, "genReadme": genReadme})

var p = Pipeline.new()

// GitHub repo creation (always runs)
p.task("github", "gh repo create %(repoName) --public --source=. --push")

// README generation only runs with --gen-readme flag
if (genReadme) {
  p.task("readme", "claude -p --output-format text --permission-mode default \"Analyze project files to determine if this is a CLI, Web App, Library, or other type. Generate a README.md following a 'Modern/Polished' style adapted to the type. Output ONLY raw markdown (no conversational text/code blocks).\"")

  // Handle README output - write to file
  p.onSuccess("readme", Fn.new { |result|
    if (result.stdout != "") {
      Log.custom("readme", "Writing README.md")
      if (File.write("README.md", result.stdout)) {
        Log.custom("readme", "README.md created successfully")
      } else {
        Log.warn("Failed to write README.md")
      }
    }
  })
}

// Vercel deployment runs after GitHub completes
p.after("github", "vercel", "vercel --prod --yes")

// Domain assignment runs after Vercel succeeds
p.after("vercel", "domain", "vercel domains add %(domain)")

// GitHub may fail if repo already exists - that's ok
p.configure("github").failureMode("continue")

// Domain assignment is optional
p.configure("domain").failureMode("continue")

// Git push at the end, only if everything succeeded
p.finally("git push")
p.finallyMode("success")

var result = p.run()

if (result.success) {
  Log.custom("deploy", "Project live at https://%(domain)")
  Log.info("Deployment completed successfully!")
} else {
  if (result.aborted) {
    Log.error("Deployment aborted due to failure")
    Process.exit(1)
  } else {
    Log.warn("Deployment completed with some non-critical failures")
  }
}
