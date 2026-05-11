export default function ToolCard({
  formData,
  setFormData,
}) {

  const TOOL_PLANS = {
    chatgpt: [
      "Free",
      "Go",
      "Plus",
      "Pro",
      "Business",
      "Enterprise",
    ],

    claude: [
      "Free",
      "Pro",
      "Max5",
      "Max20",
      "Team",
      "Enterprise",
    ],

    cursor: [
      "Hobby",
      "Pro",
      "ProPlus",
      "Teams",
      "Enterprise",
    ],

    github_copilot: [
      "Individual",
      "Business",
      "Enterprise",
    ],

    gemini: [
      "Free",
      "AIPlus",
      "AIPro",
      "AIUltra",
      "Business",
      "Enterprise",
    ],

    windsurf: [
      "Free",
      "Pro",
      "Teams",
    ],
  };

  return (
    <div className="w-full max-w-xl bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">

      {/* Tool */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          AI Tool
        </label>

        <select
          value={formData.tool}
          onChange={(e) =>
            setFormData({
              ...formData,
              tool: e.target.value,
              plan: "",
            })
          }
          className="w-full bg-white/10 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <option value="" className="text-black">
            Select tool
          </option>

          <option value="chatgpt" className="text-black">
            ChatGPT
          </option>

          <option value="claude" className="text-black">
            Claude
          </option>

          <option value="cursor" className="text-black">
            Cursor
          </option>

          <option value="github_copilot" className="text-black">
            GitHub Copilot
          </option>

          <option value="gemini" className="text-black">
            Gemini
          </option>

          <option value="windsurf" className="text-black">
            Windsurf
          </option>
        </select>
      </div>

      {/* Plan */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          Plan
        </label>

        <select
          value={formData.plan}
          onChange={(e) =>
            setFormData({
              ...formData,
              plan: e.target.value,
            })
          }
          className="w-full bg-white/10 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <option value="" className="text-black">
            Select plan
          </option>

          {formData.tool &&
            TOOL_PLANS[formData.tool]?.map((plan) => (
              <option
                key={plan}
                value={plan}
                className="text-black"
              >
                {plan}
              </option>
            ))}
        </select>
      </div>

      {/* Monthly Spend */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          Monthly Spend ($)
        </label>

        <input
          type="number"
          placeholder="e.g. 120"
          value={formData.monthlySpend}
          onChange={(e) =>
            setFormData({
              ...formData,
              monthlySpend: e.target.value,
            })
          }
          className="w-full bg-white/10 border border-white/10 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20"
        />
      </div>

      {/* Seats */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          Number of Seats
        </label>

        <input
          type="number"
          placeholder="e.g. 5"
          value={formData.seats}
          onChange={(e) =>
            setFormData({
              ...formData,
              seats: e.target.value,
            })
          }
          className="w-full bg-white/10 border border-white/10 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20"
        />
      </div>

      {/* Use Case */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          Primary Use Case
        </label>

        <select
          value={formData.useCase}
          onChange={(e) =>
            setFormData({
              ...formData,
              useCase: e.target.value,
            })
          }
          className="w-full bg-white/10 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <option value="" className="text-black">
            Select use case
          </option>

          <option value="coding" className="text-black">
            Coding
          </option>

          <option value="writing" className="text-black">
            Writing
          </option>

          <option value="research" className="text-black">
            Research
          </option>

          <option value="design" className="text-black">
            Design
          </option>
        </select>
      </div>
    </div>
  );
}