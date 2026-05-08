interface Props {
  output: string
}

export default function ConsolePanel({ output }: Props) {
  return (
    <div className="bg-black h-full p-3 overflow-auto border-t border-gray-700">
      <h2 className="mb-2 text-green-400">
        Console Output
      </h2>

      <pre className="text-sm whitespace-pre-wrap">
        {output}
      </pre>
    </div>
  )
}