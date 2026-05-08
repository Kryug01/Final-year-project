export async function runJavaScript(code: string) {

  const logs: string[] = []

  const originalLog = console.log

  // Capture console.log
  console.log = (...args) => {
    logs.push(args.join(" "))
  }

  try {

    // Execute code
    new Function(code)()

  } catch (error: any) {

    logs.push("Error: " + error.message)

  }

  // Restore console
  console.log = originalLog

  return logs.join("\n")
}