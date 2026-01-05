import { useCreateBlogRequest } from "@/app/services/blog.request";
import { formatDateShort, generateSlug } from "@/utils/utils";
import {
  LoaderCircle,
  Plus,
  Share2,
  Sparkles,
  Trash,
  Upload,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Modal } from "@/app/components/modals/Modal";
import { AIGenerateBlog } from "./AIGenerateBlog";
import parse from "html-react-parser";
import "quill/dist/quill.snow.css";
import { toast } from "sonner";
import Image from "next/image";
import Quill from "quill";

type BlogData = {
  slug: string;
  authorName: string;
  banner: string;
  title: string;
  subTitle: string;
  content: string;
  readTime: string;
};
export default function CreateBlog({
  setShowCreateBlog,
}: {
  setShowCreateBlog: any;
}) {
  const [showPreview, setShowPreview] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userImage, setUserImage] = useState<string | undefined>(undefined);
  const [blogData, setBlogData] = useState<BlogData>({
    slug: "",
    authorName: "",
    banner: "",
    title: "",
    subTitle: "",
    content: "",
    readTime: "3 min read",
  });

  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<any>(null);
  const { mutate: createBlog } = useCreateBlogRequest();

  // Initialize Quill
  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"],
              ["link", "image"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["clean"],
            ],
            handlers: {
              image: imageHandler,
            },
          },
        },
      });

      // Update content state on change
      quillInstance.current.on("text-change", () => {
        setBlogData((prev) => ({
          ...prev,
          content: quillInstance.current!.root.innerHTML,
        }));
      });
    }
  }, []);

  // Add this useEffect to your CreateBlog component to update Quill when blogData changes
  useEffect(() => {
    if (quillInstance.current && blogData.content) {
      quillInstance.current.root.innerHTML = blogData.content;
    }
  }, [blogData.content]);

  // Image upload handler
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        const quill = quillInstance.current;
        const range = quill?.getSelection();
        if (range) {
          quill?.insertEmbed(range.index, "image", base64);
        }
      };
      reader.readAsDataURL(file);
    };
  };

  // File Upload For  Banner logic
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      console.log(files[0].type, "this is the file type");

      const fileType = files[0].type;
      if (
        fileType === "image/jpg" ||
        fileType === "image/png" ||
        fileType === "image/jpeg" ||
        fileType === "image/webp"
      ) {
        setUserImage(URL.createObjectURL(files[0]));
        setSelectedFile(file);
      } else {
        toast.error("Unsupported file type. Please upload a JPG, PNG, or JPEG");
      }
    }
  };

  // Handle title change and slug generation
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setBlogData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  // CreateBlog Handler Logic
  const handleSubmit = async (mode: "create" | "publish") => {
    if (
      !blogData.title ||
      !blogData.subTitle ||
      !blogData.content ||
      !selectedFile
    ) {
      toast.error("Please fill out all fields");
      return;
    }

    // Set only one state based on mode
    if (mode === "create") {
      setIsCreating(true);
    } else {
      setIsPublishing(true);
    }

    // First upload the banner image
    let bannerUrl = "";
    if (selectedFile) {
      try {
        const bannerFormData = new FormData();
        bannerFormData.append("file", selectedFile);
        bannerFormData.append("upload_preset", "geomatic-connect");

        const bannerRes = await fetch(
          `https://api.cloudinary.com/v1_1/dgfjxhoae/image/upload`,
          {
            method: "POST",
            body: bannerFormData,
          }
        );
        const bannerData = await bannerRes.json();
        bannerUrl = bannerData.secure_url;
      } catch (error) {
        toast.error("Failed to upload banner image");
        setIsCreating(false);
        setIsPublishing(false);
        return;
      }
    }

    // Parse the HTML content and update base64 images
    const parser = new DOMParser();
    const doc = parser.parseFromString(blogData.content, "text/html");
    const imgTags = doc.querySelectorAll("img");

    for (const img of imgTags) {
      const src = img.getAttribute("src");
      if (src?.startsWith("data:")) {
        const formData = new FormData();
        formData.append("file", src);
        formData.append("upload_preset", "geomatic-connect");

        try {
          const res = await fetch(
            `https://api.cloudinary.com/v1_1/dgfjxhoae/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );
          const data = await res.json();
          img.setAttribute("src", data.secure_url);
        } catch (error) {
          console.error("Failed to upload image to Cloudinary:", error);
        }
      }
    }

    // Serialize HTML back to string
    const updatedContent = doc.body.innerHTML;

    const payload = {
      ...blogData,
      content: updatedContent,
      banner: bannerUrl,
      active: mode === "publish",
    };
    createBlog(
      {
        payload,
      },
      {
        onSuccess: () => {
          setBlogData({
            slug: "",
            authorName: "",
            banner: "",
            title: "",
            subTitle: "",
            content: "",
            readTime: "3 min read",
          });
          setShowCreateBlog(false);
          setIsCreating(false);
          setIsPublishing(false);
        },

        onError: () => {
          console.log("error occured");
          setIsCreating(false);
          setIsPublishing(false);
        },
      }
    );
  };

  return (
    <>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 py-4 px-3 gap-4">
          {/* ========Blog Editor======== */}
          <div className="w-full max-w-3xl p-5 bg-white dark:bg-muted border border-gray-200 dark:border-muted-foreground dark:border-[0.1px] rounded-lg mx-auto">
            <div className="flex items-center justify-between pb-2 mb-5 border-b border-gray-400 dark:border-muted-foreground dark:border-b-[0.1px]">
              <h2 className="text-lg lg:text-2xl font-bold"> Blog Editor</h2>
              <button
                onClick={() => setShowAIGenerator(!showAIGenerator)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-light shadow-sm bg-gradient-to-r from-[#49AD51] to-[#B1D045] dark:from-muted dark:to-muted-foreground"
              >
                Build with AI
                <Sparkles className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                {/* ======authorName======= */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="authorName"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-foreground mb-2"
                  >
                    Author
                  </label>
                  <div className="mt-2">
                    <input
                      onChange={(e) =>
                        setBlogData({ ...blogData, authorName: e.target.value })
                      }
                      type="text"
                      value={blogData.authorName}
                      name="authorName"
                      id="authorName"
                      autoComplete="given-name"
                      className="block w-full rounded-md dark:bg-muted border border-[#cbd5e1] dark:border-muted-foreground dark:border-[0.1px] py-2 px-4 text-gray-900 dark:text-foreground shadow-sm placeholder:text-gray-400 focus:ring-inset focus:ring-green-600 focus:ring-1 focus:outline-none  sm:text-sm sm:leading-6"
                      placeholder="Type Author Name here..."
                    />
                  </div>
                </div>

                {/* =====Blog Banner ===== */}
                <section className="sm:col-span-2">
                  <div className="border-[0.5px] border-slate-300 shadow-sm dark:border-muted px-4 pt-3 pb-6 md:pt-6 md:pb-6 rounded-xl bg-white dark:bg-background mt-6">
                    <p className="text-sm font-medium flex items-center justify-between">
                      Blog Banner{" "}
                      {userImage && (
                        <Trash
                          onClick={() => setUserImage(undefined)}
                          className="size-4 text-red-400 cursor-pointer"
                        />
                      )}
                    </p>
                    <div className="flex items-center justify-center space-x-2 md:space-x-6 bg-white dark:bg-muted rounded-2xl  border-[0.6px] border-slate-300 shadow-sm dark:border-muted mt-4 cursor-pointer">
                      <label
                        htmlFor="bannerInput"
                        className="w-full p-3 flex justify-between tracking-wide cursor-pointer"
                      >
                        {userImage ? (
                          <div className="rounded-xl relative mx-auto w-full">
                            <Image
                              src={userImage}
                              alt="Blog Banner"
                              width={100}
                              height={100}
                              className="rounded-xl w-full h-full max-h-40"
                            />
                          </div>
                        ) : (
                          <div className="flex w-full items-center justify-between gap-2">
                            <p className="w-full text-center">Upload image</p>
                            <input
                              type="file"
                              name="banner_Image"
                              id="bannerInput"
                              accept=".png,  .jpg, .jpeg, .webp"
                              className="hidden input-field"
                              onChange={handleFileChange}
                            />
                            <div className="border-slate-800 border-[1.3px] border-dashed rounded-full relative mx-auto flex items-center justify-center w-[45px] h-[45px]">
                              <Upload
                                size={24}
                                className="rounded-full w-[45px] h-[24px]"
                              />
                            </div>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </section>

                {/* ======Title======= */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-foreground mb-2 "
                  >
                    Blog Title
                  </label>
                  <div className="mt-2">
                    <input
                      onChange={handleTitleChange}
                      type="text"
                      value={blogData.title}
                      name="title"
                      id="title"
                      autoComplete="given-name"
                      className="block w-full rounded-md dark:bg-muted border border-[#cbd5e1] dark:border-muted-foreground dark:border-[0.1px] py-2 px-4 text-gray-900 dark:text-foreground shadow-sm placeholder:text-gray-400 focus:ring-inset focus:ring-green-600 focus:ring-1 focus:outline-none sm:text-sm sm:leading-6"
                      placeholder="Type the Course title"
                    />
                  </div>
                </div>
                {/* =====Slug===== */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="slug"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-foreground mb-2 "
                  >
                    Blog Slug
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={blogData.slug}
                      name="slug"
                      id="slug"
                      autoComplete="slug"
                      readOnly
                      className="block w-full rounded-md dark:bg-muted bg-slate-100 cursor-not-allowed border border-[#cbd5e1] dark:border-muted-foreground dark:border-[0.1px] py-2 px-4 text-gray-900 dark:text-foreground shadow-sm placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"
                      placeholder="blug--slug"
                    />
                  </div>
                </div>
                {/* ===== SubTitle ====== */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="subTitle"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-foreground dark:text-white"
                  >
                    Blog Description
                  </label>
                  <textarea
                    id="subTitle"
                    name="subTitle"
                    rows={4}
                    onChange={(e) =>
                      setBlogData({ ...blogData, subTitle: e.target.value })
                    }
                    value={blogData.subTitle}
                    className="block p-2.5 w-full text-sm text-gray-900 dark:text-foreground bg-white dark:bg-muted rounded-lg border border-gray-300 dark:border-muted-foreground dark:border-[0.1px] focus:ring-inset focus:ring-green-600 focus:ring-1 focus:outline-none "
                    placeholder="Write your thoughts here..."
                  ></textarea>
                </div>
                {/* ====== Content ===== */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="content"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-foreground dark:text-white"
                  >
                    Blog Content
                  </label>
                  <div ref={editorRef} style={{ height: "200px" }} />
                </div>
              </div>
              <div className="xl:flex items-center justify-between">
                <button
                  type="submit"
                  disabled={isCreating}
                  onClick={() => handleSubmit("create")}
                  className="flex justify-center items-center gap-1 mt-4 sm:mt-6 text-sm text-center text-white rounded-[8px] cursor-pointer  px-3.5 py-3 font-light shadow-sm bg-gradient-to-r from-[#49AD51] to-[#B1D045] dark:from-muted dark:to-muted-foreground"
                >
                  {isCreating ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin duration-500 mx-auto" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Save Draft
                    </>
                  )}
                </button>

                <button
                  type="submit"
                  disabled={isPublishing}
                  onClick={() => handleSubmit("publish")}
                  className="flex justify-center items-center gap-1 mt-4 sm:mt-6 text-sm text-center text-white rounded-[8px] cursor-pointer  px-3.5 py-3 font-light shadow-sm bg-gradient-to-r from-[#49AD51] to-[#B1D045] dark:from-muted dark:to-muted-foreground"
                >
                  {isPublishing ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin duration-500 mx-auto" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Publish Blog Post
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/*========Blog View======= */}
          <div className="w-full max-w-3xl p-7 bg-white dark:bg-muted border border-gray-200 dark:border-muted-foreground dark:border-[0.1px] rounded-lg mx-auto">
            <div className="flex items-center justify-between pb-2 mb-5 border-b border-gray-400 dark:border-muted-foreground dark:border-b-[0.1px]">
              <h2 className="text-lg lg:text-2xl font-bold">Blog View</h2>
              <div
                onClick={() => setShowPreview(true)}
                className="flex p-2 justify-center items-center gap-[8px] rounded text-white w-[120px] md:w-[150px] lg:w-[120px] cursor-pointer font-light shadow-sm bg-gradient-to-r from-[#49AD51] to-[#B1D045] dark:from-muted dark:to-muted-foreground"
              >
                <p className="text-[#FFFFFF] text-sm md:text-md">
                  Preveiw Blog
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <h2 className="block text-sm font-medium leading-6 text-gray-900 dark:text-foreground mb-2 ">
                  Blog Title
                </h2>
                <div className="mt-2">
                  <p className="text-xl font-bold">{blogData.title}</p>
                </div>
              </div>
              <div className="sm:col-span-2">
                <h2 className="block text-sm font-medium leading-6 text-gray-900 dark:text-foreground mb-2 ">
                  Blog Slug
                </h2>
                <div className="mt-2">
                  <p>{blogData.slug}</p>
                </div>
              </div>
              <div className="sm:col-span-2">
                <h2 className="block mb-2 text-sm font-medium text-gray-900 dark:text-foreground">
                  Blog Description
                </h2>
                <p>{blogData.subTitle}</p>
              </div>
              <div className="sm:col-span-full">
                <h2 className="block mb-2 text-sm font-medium text-gray-900 dark:text-foreground">
                  Blog Content
                </h2>
                {parse(blogData.content)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showAIGenerator} onClose={() => setShowAIGenerator(false)}>
        <div className="w-full max-w-3xl p-5 bg-white dark:bg-muted border border-gray-200 dark:border-muted-foreground dark:border-[0.1px] rounded-lg mx-auto mb-4">
          <AIGenerateBlog
            setBlogData={setBlogData}
            setShowAIGenerator={setShowAIGenerator}
          />
        </div>
      </Modal>
      <Modal show={showPreview} onClose={() => setShowPreview(false)}>
        <div className="w-full md:w-[672px] lg:w-[768px] p-7 bg-whit dark:bg-muted border border-gray-200 dark:border-muted-foreground dark:border-[0.1px] rounded-lg">
          <h2 className="flex justify-between text-2xl lg:text-3xl font-bold border-b border-gray-400 dark:border-muted-foreground dark:border-b-[0.1px] pb-2 mb-5 ">
            Blog View
            <X
              onClick={() => setShowPreview(false)}
              className="hover:bg-slate-100 cursor-pointer h-fit w-fit p-1.5 rounded-md"
            />
          </h2>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm">
              <p>{formatDateShort(new Date().toISOString())}</p>
              <div className="text-base w-1 h-1 rounded-full bg-slate-300" />
              <p className="underline text-blue-400"> {blogData?.authorName}</p>
            </div>
            <div className="cursor-pointer">
              <p className="flex items-center cursor-pointer gap-2 border text-sm border-slate-200 dark:border-background bg-white dark:bg-muted-foreground rounded-2xl px-3 py-1">
                <Share2 className="size-4" />
                Share
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <h2 className="text-2xl md:text-3xl font-bold mt-2">
                {blogData?.title}
              </h2>
            </div>
            <div className="sm:col-span-2">
              <p>{blogData?.subTitle}</p>
            </div>
            <div className="sm:col-span-full">
              {typeof blogData?.content === "string" ? (
                parse(blogData.content)
              ) : (
                <p>No content available</p>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
