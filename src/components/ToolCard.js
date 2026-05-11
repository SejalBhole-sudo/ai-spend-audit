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

  const selectStyles =
    "w-full appearance-none bg-black/30 border border-white/20 hover:border-blue-400/40 cursor-pointer text-white rounded-2xl px-5 py-4 text-base shadow-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-all duration-200";

  const inputStyles =
    "w-full bg-black/30 border border-white/20 hover:border-blue-400/40 text-white placeholder-gray-400 rounded-2xl px-5 py-4 text-base shadow-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-all duration-200";

  return (
    <div className="w-full space-y-6">

      {/* Tool */}
      <div>
        <label htmlFor="tool-select" className="block text-sm font-medium text-gray-300 mb-2">
          AI Tool
        </label>

        <select
          id="tool-select"
          value={formData.tool}
          onChange={(e) =>
            setFormData({
              ...formData,
              tool: e.target.value,
              plan: "",
            })
          }
          className={selectStyles}
        >
          <option
            value=""
            disabled
            hidden
            className="bg-gray-900 text-gray-400"
          >
            Select tool
          </option>

          <option value="chatgpt" className="bg-gray-900 text-white">
            ChatGPT
          </option>

          <option value="claude" className="bg-gray-900 text-white">
            Claude
          </option>

          <option value="cursor" className="bg-gray-900 text-white">
            Cursor
          </option>

          <option value="github_copilot" className="bg-gray-900 text-white">
            GitHub Copilot
          </option>

          <option value="gemini" className="bg-gray-900 text-white">
            Gemini
          </option>

          <option value="windsurf" className="bg-gray-900 text-white">
            Windsurf
          </option>
        </select>
      </div>

     {/* Plan */}
<div>
  <label htmlFor="plan-select" className="block text-sm font-medium text-gray-300 mb-2">
    Plan
  </label>

  <select 
    id="plan-select"
    value={formData.plan}
    onChange={(e) =>
      setFormData({
        ...formData,
        plan: e.target.value,
      })
    }
    disabled={!formData.tool}
    className={selectStyles}
  >
    <option value="" disabled hidden>
      {formData.tool ? 'Select plan' : 'Select a tool first'}
    </option>

    {formData.tool && TOOL_PLANS[formData.tool] && 
      TOOL_PLANS[formData.tool].map((plan) => (
        <option key={plan} value={plan} className="bg-gray-900 text-white">
          {plan}
        </option>
      ))
    }
  </select>
</div>

      {/* Monthly Spend */}
      <div>
        <label htmlFor="monthly-spend" className="block text-sm font-medium text-gray-300 mb-2">
          Monthly Spend ($)
        </label>

        <input
          id="monthly-spend"
          type="number"
          placeholder="e.g. 120"
          value={formData.monthlySpend}
          onChange={(e) =>
            setFormData({
              ...formData,
              monthlySpend: e.target.value,
            })
          }
          className={inputStyles}
        />
      </div>

      {/* Seats */}
      <div>
        <label htmlFor="seats" className="block text-sm font-medium text-gray-300 mb-2">
          Number of Seats
        </label>

        <input
          id="seats"
          type="number"
          placeholder="e.g. 5"
          value={formData.seats}
          onChange={(e) =>
            setFormData({
              ...formData,
              seats: e.target.value,
            })
          }
          className={inputStyles}
        />
      </div>

      {/* Use Case */}
      <div>
        <label htmlFor="use-case" className="block text-sm font-medium text-gray-300 mb-2">
          Primary Use Case
        </label>

        <select
          id="use-case"
          value={formData.useCase}
          onChange={(e) =>
            setFormData({
              ...formData,
              useCase: e.target.value,
            })
          }
          className={selectStyles}
        >
          <option
            value=""
            disabled
            hidden
            className="bg-gray-900 text-gray-400"
          >
            Select use case
          </option>

          <option value="coding" className="bg-gray-900 text-white">
            Coding
          </option>

          <option value="writing" className="bg-gray-900 text-white">
            Writing
          </option>

          <option value="research" className="bg-gray-900 text-white">
            Research
          </option>

          <option value="design" className="bg-gray-900 text-white">
            Design
          </option>
        </select>
      </div>
    </div>
  );
}