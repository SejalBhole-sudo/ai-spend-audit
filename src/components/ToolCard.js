export default function ToolCard({
  formData,
  setFormData,
}) {
  return (
    <div className="w-full max-w-xl bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">

      {/* Tool */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          AI Tool
        </label>

        <select
          value={formData.tool}
          onChange={(e) =>
            setFormData({
              ...formData,
              tool: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">Select tool</option>

          <option value="chatgpt">
            ChatGPT
          </option>

          <option value="claude">
            Claude
          </option>

          <option value="cursor">
            Cursor
          </option>

          <option value="github_copilot">
            GitHub Copilot
          </option>

          <option value="gemini">
            Gemini
          </option>

          <option value="windsurf">
            Windsurf
          </option>
        </select>
      </div>

      {/* Plan */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
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
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">Select plan</option>

          <option value="Free">
            Free
          </option>

          <option value="Plus">
            Plus
          </option>

          <option value="Pro">
            Pro
          </option>

          <option value="Team">
            Team
          </option>

          <option value="Business">
            Business
          </option>

          <option value="Enterprise">
            Enterprise
          </option>

          <option value="Max">
            Max
          </option>

          <option value="Individual">
            Individual
          </option>
        </select>
      </div>

      {/* Monthly Spend */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
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
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Seats */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
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
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Use Case */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
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
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">Select use case</option>

          <option value="coding">
            Coding
          </option>

          <option value="writing">
            Writing
          </option>

          <option value="research">
            Research
          </option>

          <option value="design">
            Design
          </option>
        </select>
      </div>
    </div>
  );
}