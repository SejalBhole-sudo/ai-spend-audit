export default function ToolCard({
  formData,
  setFormData,
}) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <input
        type="text"
        placeholder="Tool Name"
        className="border p-3 rounded-lg"
        value={formData.tool}
        onChange={(e) =>
          setFormData({
            ...formData,
            tool: e.target.value,
          })
        }
      />

      <input
        type="text"
        placeholder="Plan"
        className="border p-3 rounded-lg"
        value={formData.plan}
        onChange={(e) =>
          setFormData({
            ...formData,
            plan: e.target.value,
          })
        }
      />

      <input
        type="number"
        placeholder="Monthly Spend ($)"
        className="border p-3 rounded-lg"
        value={formData.monthlySpend}
        onChange={(e) =>
          setFormData({
            ...formData,
            monthlySpend: e.target.value,
          })
        }
      />

      <input
        type="number"
        placeholder="Number of Seats"
        className="border p-3 rounded-lg"
        value={formData.seats}
        onChange={(e) =>
          setFormData({
            ...formData,
            seats: e.target.value,
          })
        }
      />

      <input
        type="text"
        placeholder="Primary Use Case"
        className="border p-3 rounded-lg"
        value={formData.useCase}
        onChange={(e) =>
          setFormData({
            ...formData,
            useCase: e.target.value,
          })
        }
      />
    </div>
  );
}