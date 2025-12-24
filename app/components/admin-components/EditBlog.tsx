import { LoaderCircle, Plus, Share2, Trash, Upload, X } from "lucide-react";
import { useUpdateBlogRequest } from "@/app/services/blog.request";
import { formatDateShort, generateSlug } from "@/utils/utils";
import React, { useEffect, useRef, useState } from "react";
import { Modal } from "@/app/components/modals/Modal";
import parse from "html-react-parser";
import "quill/dist/quill.snow.css";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import Quill from "quill";

interface BlogDetailDataProps {
  data: {
    _id: any;
    slug: string;
    authorName: string;
    banner: string;
    title: string;
    subTitle: string;
    content: string;
    readTime?: string;
    createdAt: string;
  };
}

type BlogData = {
  authorName: string;
  banner: string;
  title: string;
  slug: string;
  subTitle: string;
  content: string;
  readTime: string;
  createdAt: string;
};

export default function EditBlog({
  blogDetailData,
  token,
  setShowEditBlog,
}: {
  blogDetailData: BlogDetailDataProps;
  token: string;
  setShowEditBlog: any;
}) {
  const blogId = blogDetailData?.data?._id;
  const [showPreview, setShowPreview] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
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
    createdAt: "",
  });

  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<any>(null);
  const { mutate: updateBlogRequest } = useUpdateBlogRequest();

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

  // Set initial Quill content when blogData changes
  useEffect(() => {
    if (quillInstance.current && blogData.content) {
      if (quillInstance.current.root.innerHTML !== blogData.content) {
        quillInstance.current.root.innerHTML = blogData.content;
      }
    }
  }, [blogData.content]);

  // Load blog data from API into state when it's available
  useEffect(() => {
    if (blogDetailData?.data) {
      setBlogData({
        slug: blogDetailData.data.slug || "",
        authorName: blogDetailData.data.authorName || "",
        banner: blogDetailData.data.banner || "",
        title: blogDetailData.data.title || "",
        subTitle: blogDetailData.data.subTitle || "",
        content: blogDetailData.data.content || "",
        readTime: blogDetailData.data.readTime || "3 min read",
        createdAt: blogDetailData.data.createdAt,
      });
    }
  }, [blogDetailData]);

  // Image upload handler
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        const quill = quillInstance.current;
        const range = quill?.getSelection();
        if (range) {
          quill?.insertEmbed(range.index, "image", base64 as string);
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
        toast.error(
          "Unsupported file type. Please upload a JPG, PNG, WEBP, or JPEG"
        );
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

  // At the bottom of your CreateBlog component
  const handleSubmit = async (mode: "create" | "publish") => {
    if (!blogData.title || !blogData.subTitle || !blogData.content) {
      toast.error("Please fill out all fields");
      return;
    }

    // Set only one state based on mode
    if (mode === "create") {
      setIsUpdating(true);
    } else {
      setIsPublishing(true);
    }

    // Handle banner image
    let bannerUrl = blogData.banner;
    if (selectedFile) {
      try {
        const bannerFormData = new FormData();
        bannerFormData.append("file", selectedFile);
        bannerFormData.append("upload_preset", "geomatic-connect");

        const bannerRes = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
          {
            method: "POST",
            body: bannerFormData,
          }
        );
        const bannerData = await bannerRes.json();
        bannerUrl = bannerData.secure_url;
      } catch (error) {
        toast.error("Failed to upload banner image");
        setIsUpdating(false);
        setIsPublishing(false);
        return;
      }
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(blogData.content, "text/html");
    const images = doc.querySelectorAll("img");

    for (let img of images) {
      const src = img.getAttribute("src");
      if (src && src.startsWith("data:image/")) {
        // Upload to Cloudinary
        const formData = new FormData();
        formData.append("file", src);
        formData.append("upload_preset", "geomatic-connect");

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        img.setAttribute("src", data.secure_url);
      }
    }

    const updatedContent = doc.body.innerHTML;

    const payload = {
      ...blogData,
      content: updatedContent,
      banner: bannerUrl,
      active: mode === "publish",
    };

    updateBlogRequest(
      { blogId, payload },
      {
        onSuccess: () => {
          setShowEditBlog(false);
          setIsUpdating(false);
          setIsPublishing(false);
        },
        onError: () => {
          setIsUpdating(false);
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
          <div className="w-full max-w-3xl p-5 bg-white border border-gray-200 rounded-lg mx-auto">
            <h2 className="text-lg lg:text-2xl font-bold border-b border-gray-400 pb-2 mb-5 ">
              Blog Editor
            </h2>
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
                    className="block text-sm font-medium leading-6 text-gray-900 mb-2"
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
                      className="block w-full rounded-md border border-[#cbd5e1] py-2 px-4 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-inset focus:ring-green-600 focus:ring-1 focus:outline-none  sm:text-sm sm:leading-6"
                      placeholder="Type Author Name here..."
                    />
                  </div>
                </div>

                {/* =====Blog Banner ===== */}
                <section className="sm:col-span-2">
                  <div className="border-[0.5px] border-slate-300 shadow-sm dark:border-muted px-4 pt-3 pb-6 md:pt-6 md:pb-6 rounded-xl bg-white  mt-6">
                    <p className="text-sm font-medium flex items-center justify-between">
                      Blog Banner{" "}
                      {userImage ||
                        (blogData?.banner && (
                          <Trash
                            onClick={() => {
                              setUserImage(undefined);
                              setSelectedFile(null);
                              setBlogData((prev) => ({ ...prev, banner: "" }));
                            }}
                            className="size-4 text-red-400 cursor-pointer"
                          />
                        ))}
                    </p>
                    <div className="flex items-center justify-center space-x-2 md:space-x-6 bg-white dark:bg-background rounded-2xl  border-[0.6px] border-slate-300 shadow-sm dark:border-muted mt-4 cursor-pointer">
                      <label
                        htmlFor="bannerInput"
                        className="w-full p-3 flex justify-between tracking-wide cursor-pointer"
                      >
                        {userImage || blogData?.banner ? (
                          <div className="rounded-xl relative mx-auto w-full">
                            <Image
                              src={blogData?.banner || (userImage as string)}
                              alt="Blog Banner"
                              width={100}
                              height={100}
                              className="rounded-xl w-full h-full max-h-40 object-cover"
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
                    className="block text-sm font-medium leading-6 text-gray-900 mb-2 "
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
                      className="block w-full rounded-md border border-[#cbd5e1] py-2 px-4 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-inset focus:ring-green-600 focus:ring-1 focus:outline-none sm:text-sm sm:leading-6"
                      placeholder="Type the Course title"
                    />
                  </div>
                </div>
                {/* =====Slug===== */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="slug"
                    className="block text-sm font-medium leading-6 text-gray-900 mb-2 "
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
                      className="block w-full rounded-md bg-slate-100 cursor-not-allowed border border-[#cbd5e1] py-2 px-4 text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"
                      placeholder="blug--slug"
                    />
                  </div>
                </div>
                {/* ===== SubTitle ====== */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="subTitle"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
                    className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-inset focus:ring-green-600 focus:ring-1 focus:outline-none "
                    placeholder="Write your thoughts here..."
                  ></textarea>
                </div>
                {/* ====== Content ===== */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="content"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Blog Content
                  </label>
                  <div ref={editorRef} style={{ height: "200px" }} />
                </div>
              </div>
              <div className="xl:flex items-center justify-between">
                <button
                  type="submit"
                  disabled={isUpdating}
                  onClick={() => handleSubmit("create")}
                  className="flex justify-center items-center gap-1 mt-4 sm:mt-6 text-sm text-center text-white rounded-[8px] cursor-pointer  px-3.5 py-3 font-light shadow-sm bg-gradient-to-r from-[#49AD51] to-[#B1D045]"
                >
                  {isUpdating ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin duration-500 mx-auto" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Update Blog Post
                    </>
                  )}
                </button>
                <button
                  type="submit"
                  disabled={isPublishing}
                  onClick={() => handleSubmit("publish")}
                  className="flex justify-center items-center gap-1 mt-4 sm:mt-6 text-sm text-center text-white rounded-[8px] cursor-pointer  px-3.5 py-3 font-light shadow-sm bg-gradient-to-r from-[#49AD51] to-[#B1D045]"
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
          <div className="w-full max-w-3xl p-7 bg-white border border-gray-200 rounded-lg mx-auto">
            <div className="flex items-center justify-between pb-2 mb-5 border-b border-gray-400">
              <h2 className="text-lg lg:text-2xl font-bold">Blog View</h2>
              <div
                onClick={() => setShowPreview(true)}
                className="flex p-2 md:p-3 justify-center items-center gap-[8px] rounded-[8px] text-white w-[120px] md:w-[150px] lg:w-[120px] cursor-pointer  px-2 py-3 font-light shadow-sm bg-gradient-to-r from-[#49AD51] to-[#B1D045]"
              >
                <p className="text-[#FFFFFF] text-sm md:text-md">
                  Preveiw Blog
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <h2 className="block text-sm font-medium leading-6 text-gray-900 mb-2 ">
                  Blog Title
                </h2>
                <div className="mt-2">
                  <p className="text-xl font-bold">{blogData.title}</p>
                </div>
              </div>
              <div className="sm:col-span-2">
                <h2 className="block text-sm font-medium leading-6 text-gray-900 mb-2 ">
                  Blog Slug
                </h2>
                <div className="mt-2">
                  <p>{blogData.slug}</p>
                </div>
              </div>
              <div className="sm:col-span-2">
                <h2 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Blog Description
                </h2>
                <p>{blogData.subTitle}</p>
              </div>
              <div className="sm:col-span-full">
                <h2 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Blog Content
                </h2>
                {typeof blogData.content === "string" ? (
                  parse(blogData.content)
                ) : (
                  <p>No content available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showPreview} onClose={() => setShowPreview(false)}>
        <div className="w-full md:w-[672px] lg:w-[768px] p-7 bg-white border border-gray-200 rounded-lg">
          <h2 className="flex justify-between text-2xl font-bold border-b border-gray-400 pb-2 mb-5 ">
            Geomatic Blog
            <X
              onClick={() => setShowPreview(false)}
              className="hover:bg-slate-100 cursor-pointer h-fit w-fit p-1.5 rounded-md"
            />
          </h2>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm">
              <p>{formatDateShort(blogData?.createdAt)}</p>
              <div className="text-base w-1 h-1 rounded-full bg-slate-300" />
              <Link href="#" className="underline text-blue-400">
                {blogData.authorName}
              </Link>
            </div>
            <div className="cursor-pointer">
              <p className="flex items-center cursor-pointer gap-2 border text-sm border-slate-200 bg-white rounded-2xl px-3 py-1">
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
