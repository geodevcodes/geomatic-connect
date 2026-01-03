import { useState } from "react";
import { useChat } from "ai/react";
import { generateSlug } from "@/utils/utils";
import { LoaderCircle, X } from "lucide-react";

export function AIGenerateBlog({
  setBlogData,
  setShowAIGenerator,
}: {
  setBlogData: any;
  setShowAIGenerator: any;
}) {
  const [generating, setGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("professional");
  const [style, setStyle] = useState("informative");
  const [length, setLength] = useState("medium");
  const [error, setError] = useState("");

  const { messages, append, isLoading } = useChat({
    api: "/api/openai",
    onFinish: (message) => {
      try {
        const parsedContent = JSON.parse(message.content);
        setBlogData((prev: any) => ({
          ...prev,
          title: parsedContent.title,
          subTitle: parsedContent.subTitle,
          content: parsedContent.content,
          slug: generateSlug(parsedContent.title),
        }));
      } catch (error) {
        console.error("Failed to parse AI response:", error);
        setError("Failed to parse the generated content. Please try again.");
      }
      setGenerating(false);
    },
    onError: (error) => {
      setError(error.message);
      setGenerating(false);
    },
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a blog topic");
      return;
    }
    setError("");
    setGenerating(true);

    try {
      await append({
        role: "user",
        content: `Generate a blog post about: ${prompt}. 
        Tone: ${tone}. 
        Style: ${style}. 
        Length: ${length}.`,
      });
      setShowAIGenerator(false);
    } catch (err) {
      setError("Failed to generate content. Please try again.");
      setGenerating(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-muted">
      <h3 className="flex justify-between items-center text-lg font-semibold">
        AI Blog Generator
        <X
          onClick={() => setShowAIGenerator(false)}
          className="hover:bg-slate-100 cursor-pointer h-fit w-fit p-1.5 rounded-md"
        />
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Blog Topic</label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-2 border rounded dark:bg-muted dark:border-muted-foreground dark:border-[0.1px]"
            placeholder="What should the blog be about?"
          />
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-2 border rounded dark:bg-muted dark:border-muted-foreground dark:border-[0.1px]"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="enthusiastic">Enthusiastic</option>
              <option value="authoritative">Authoritative</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full p-2 border rounded dark:bg-muted dark:border-muted-foreground dark:border-[0.1px]"
            >
              <option value="informative">Informative</option>
              <option value="storytelling">Storytelling</option>
              <option value="how-to">How-to Guide</option>
              <option value="list">Listicle</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Length</label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full p-2 border rounded dark:bg-muted dark:border-muted-foreground dark:border-[0.1px]"
            >
              <option value="short">Short (300 words)</option>
              <option value="medium">Medium (600 words)</option>
              <option value="long">Long (1000+ words)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="flex items-center justify-center px-4 py-2 font-light shadow-sm bg-gradient-to-r from-[#49AD51] to-[#B1D045] dark:bg-muted dark:bg-gradient-to-r dark:from-muted dark:to-muted-foreground text-white rounded"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="size-4 animate-spin duration-500 mx-auto -ml-1 mr-2" />
              Generating...
            </>
          ) : (
            "Generate Blog Content"
          )}
        </button>
      </div>
    </div>
  );
}
