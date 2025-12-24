import {
  useCompanyApproveStudentRequest,
  useCompanyDeclineStudentRequest,
  useGetStudentsByCompanyRequest,
} from "@/app/services/request.request";
import { Modal } from "@/app/components/modals/Modal";
import { CardSkeleton } from "@/app/components/skeletons/CardSkeleton";
import ApproveMessage from "@/app/components/company-components/ApproveMessage";
import DeclineMessage from "@/app/components/company-components/DeclineMessage";
import { CircleUserRound, Eye, GraduationCap, MapPin } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import Trash from "@/app/components/trash/Trash";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

interface StudentCardProps {
  token: string;
  companyId: string;
  selectedState: string;
  search: string;
}

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function StudentCard({
  token,
  companyId,
  selectedState,
  search,
}: StudentCardProps) {
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState();
  const [showConfirmApprove, setShowConfirmApprove] = useState(false);
  const [showConfirmDecline, setShowConfirmDecline] = useState(false);
  const [showStudentFile, setShowStudentFile] = useState(false);
  const [numPages, setNumPages] = useState<number>();

  const { data: studentsData, isLoading } = useGetStudentsByCompanyRequest(
    companyId,
    selectedState,
    search
  );
  const { mutate: companyApproveStudentRequest } =
    useCompanyApproveStudentRequest();

  const { mutate: companyDeclineStudentRequest } =
    useCompanyDeclineStudentRequest();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  // Send Approved Request to Admin Logic
  const handleApprovedRequest = async (requestId: any) => {
    const payload = {
      requestId: requestId,
    };
    companyApproveStudentRequest(
      {
        payload,
      },
      {
        onSuccess: () => {
          console.log("request approved successfully");
        },
        onError: () => {
          console.log("error creating request");
        },
      }
    );
  };

  // Send Decline Request to Admin Logic
  const handleDeclinedRequest = async (requestId: any) => {
    const payload = {
      requestId: requestId,
    };
    companyDeclineStudentRequest(
      {
        payload,
      },
      {
        onSuccess: () => {
          console.log("request approved successfully");
        },
        onError: () => {
          console.log("error creating request");
        },
      }
    );
  };

  return (
    <>
      {isLoading ? (
        <div>
          <CardSkeleton />
        </div>
      ) : studentsData?.data?.length === 0 ||
        studentsData?.data?.length === undefined ? (
        <>
          <div className="gap-2 my-10 md:mt-24">
            <Trash
              headingText="No Student Available"
              subHeadingText="No request have been found yet. Click the 'Subscribe' button to upgrade your account."
            />
          </div>
        </>
      ) : (
        <div className="space-y-8 md:gap-6 md:grid md:grid-cols-2 xl:grid-cols-3 md:space-y-0">
          {studentsData?.data?.map((item: any) => (
            <div key={item._id}>
              <div className="max-w-[400px] pt-0 pb-6 border border-slate-300 dark:border-muted bg-white dark:bg-muted">
                <p className="text-sm text-center justify-end flex flex-row font-normal text-white dark:text-accent-foreground">
                  <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-100 p-2 px-1.5 text-xs font-medium">
                    {item?.source}
                  </span>
                </p>
                <div className="p-6 mx-4 border-b-[1.3px] border-slate-200 dark:border-muted text-black flex flex-col items-center">
                  <div>
                    {item?.user?.avatarImage ? (
                      <Image
                        src={item?.user?.avatarImage}
                        alt="profile image"
                        width={100}
                        height={100}
                        priority
                        className="w-[100px] h-[100px] rounded-full object-cover border-[1.3px] border-slate-200"
                      />
                    ) : (
                      <CircleUserRound className="size-28 dark:text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-xl font-medium dark:text-accent-foreground">
                    {item?.user?.fullName}
                  </p>
                  <p className="font-light text-sm dark:text-accent-foreground">
                    {item?.user?.institutionName}
                  </p>
                </div>
                <div className="px-6">
                  <p className="font-medium my-3">About</p>
                  <p className="font-light text-sm text-ellipsis  line-clamp-2">
                    {item?.user?.aboutMe}
                  </p>
                  <div className="space-y-2 my-3 font-light text-sm">
                    <div className="flex items-center gap-2">
                      <GraduationCap size={24} />
                      <span>Product of {item?.user?.institutionName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <MapPin size={24} />
                        <span>Resides in {item?.user?.state}</span>
                      </div>
                      <div
                        onClick={() => {
                          if (!item?.user?.documentFile) {
                            toast.error("No file added");
                          } else {
                            setSelectedPdfUrl(item?.user?.documentFile || null);
                            setShowStudentFile(true);
                          }
                        }}
                        className="flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye /> View File
                      </div>
                    </div>
                  </div>
                  <p className="font-medium">Experience</p>
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    <p className="bg-[#E6E9EB] p-2 dark:text-primary-foreground">
                      Engineering
                    </p>
                    <p className="bg-[#E6E9EB] p-2 dark:text-primary-foreground">
                      Cadastral
                    </p>
                    <p className="bg-[#E6E9EB] p-2 dark:text-primary-foreground">
                      GIS/Remote
                    </p>
                    <p className="bg-[#E6E9EB] p-2 dark:text-primary-foreground">
                      Drone Piloting
                    </p>
                    <p className="bg-[#E6E9EB] p-2 dark:text-primary-foreground">
                      Topographical
                    </p>
                    <p className="bg-[#E6E9EB] p-2 dark:text-primary-foreground">
                      Hydrographical
                    </p>
                  </div>
                </div>
                {/* === PROFILE BUTTON === */}
                <div className="flex gap-3 justify-between">
                  <p
                    onClick={() => {
                      setShowConfirmApprove(true);
                      setSelectedRequestId(item?.requestId);
                    }}
                    className="bg-[#33A852] text-xs md:text-md w-[120px] md:w-[150px] text-center text-white p-2 mt-12 mx-auto cursor-pointer flex items-center justify-center"
                  >
                    Approve Request
                  </p>

                  <p
                    onClick={() => {
                      setShowConfirmDecline(true);
                      setSelectedRequestId(item?.requestId);
                    }}
                    className="bg-[#D92D20] text-xs md:text-md  w-[120px] md:w-[150px] text-center text-white p-3 mt-12 mx-auto cursor-pointer flex items-center justify-center"
                  >
                    Decline Request
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== PDF Viewer ==== */}
      <Modal show={showStudentFile} onClose={() => setShowStudentFile(false)}>
        <div className="w-full h-[90vh] overflow-auto">
          {selectedPdfUrl && (
            <Document
              file={selectedPdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<p className="text-center mt-10">Loading PDF...</p>}
              error={
                <p className="text-center text-red-500">Failed to load PDF</p>
              }
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} />
              ))}
            </Document>
          )}
        </div>
      </Modal>

      <Modal
        show={showConfirmApprove}
        onClose={() => setShowConfirmApprove(false)}
      >
        <ApproveMessage
          setShowConfirmApprove={setShowConfirmApprove}
          handleApprovedRequest={handleApprovedRequest}
          requestId={selectedRequestId}
        />
      </Modal>

      <Modal
        show={showConfirmDecline}
        onClose={() => setShowConfirmDecline(false)}
      >
        <DeclineMessage
          setShowConfirmDecline={setShowConfirmDecline}
          handleDeclinedRequest={handleDeclinedRequest}
          requestId={selectedRequestId}
        />
      </Modal>
    </>
  );
}
