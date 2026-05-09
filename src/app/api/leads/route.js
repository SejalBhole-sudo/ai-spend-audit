export async function POST(req) {
  try {
    const body = await req.json()

    console.log("New Lead Captured:")
    console.log(body)

    return Response.json({
      success: true,
    })

  } catch (error) {
    console.error(error)

    return Response.json(
      {
        success: false,
        error: "Failed to save lead",
      },
      { status: 500 }
    )
  }
}