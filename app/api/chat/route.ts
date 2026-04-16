import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.LLM_KEY_OPENAI_GPT,
});

export async function POST(request: Request) {
  const { content } = await request.json();

  const stream = openai.responses.create({
    model: "gpt-5.4",
    input: [{
      role: "user", 
      content, 
    }],
    stream: true,
  });

  const streamable = new ReadableStream({
    async start(controller) {
      for await (const chunk of await stream) {
        if(chunk.type === 'response.output_text.delta') {
          // Get the data and send it to the browser via the controller
          controller.enqueue(new TextEncoder().encode(chunk.delta));
        }
      }
      controller.close();
    }
  });
  
  return new Response(streamable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}


// *** NOTES ***
// GET = retrieve
// POST = create new resource
// PUT = replace entire resource
// PATCH = partially update resource
// DELETE = delete
// HEAD = like get, returns headers only
// OPTIONS =. ask server, what opts. are allowed