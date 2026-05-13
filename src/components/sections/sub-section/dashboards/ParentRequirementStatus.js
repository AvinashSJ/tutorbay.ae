"use client";
import MailboxModal from "@/components/shared/matching/MailboxModal";
import CreateRequirementForm from "@/components/sections/create-requirement/CreateRequirementPrimary";
import { useGetUserPostsQuery } from "@/redux/services/userSlice";
import { useDeleteRequirementMutation } from "@/redux/services/parentSlice";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState, useMemo } from "react";
import { getSupabase } from "@/libs/supabase";
import Link from "next/link";
import Swal from "sweetalert2";

const STATUS_BADGE = {
  DRAFT: { label: "Draft", cls: "bg-orange text-white" },
  PUBLISHED: { label: "Published", cls: "bg-blue text-white" },
  OPEN: { label: "Active", cls: "bg-greencolor2 text-white" },
  CLOSED: { label: "Closed", cls: "bg-secondaryColor text-white" },
  CANCELLED: { label: "Cancelled", cls: "bg-red text-white" },
};

const ParentRequirementStatus = () => {
  const { userId } = useUser();
  const { data: userPosts, error, isLoading } = useGetUserPostsQuery(userId);
  const [deleteRequirement] = useDeleteRequirementMutation();
  const [applicantCounts, setApplicantCounts] = useState({});
  const [selectedMailbox, setSelectedMailbox] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingReq, setEditingReq] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [loadingFull, setLoadingFull] = useState(false);

  const selectedRequirement = selectedMailbox
    ? userPosts?.find((r) => r.id === selectedMailbox)
    : null;

  useEffect(() => {
    if (!userPosts?.length) return;
    const ids = userPosts.map((r) => r.id).filter(Boolean);
    if (!ids.length) return;
    const fetchCounts = async () => {
      const supabase = getSupabase();
      const { data } = await supabase.rpc("get_requirement_applicant_counts", { p_requirement_ids: ids });
      if (data) {
        const map = {};
        data.forEach((r) => { map[r.requirement_id] = Number(r.count); });
        setApplicantCounts(map);
      }
    };
    fetchCounts();
  }, [userPosts]);

  const handleEdit = async (req) => {
    setLoadingFull(true);
    const supabase = getSupabase();
    const { data } = await supabase.from("Requirement").select("*").eq("id", req.id).single();
    if (data) {
      setEditingData(data);
      setEditingReq(req);
      setShowForm(true);
    }
    setLoadingFull(false);
  };

  const handleDelete = (req) => {
    Swal.fire({
      title: "Delete Requirement?",
      text: `Are you sure you want to delete "${req.title || req.subject}"? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteRequirement(req.id).unwrap();
          Swal.fire("Deleted!", "Requirement has been deleted.", "success");
        } catch {
          Swal.fire("Error!", "Failed to delete requirement.", "error");
        }
      }
    });
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingReq(null);
    setEditingData(null);
  };

  const sortedPosts = useMemo(
    () => (userPosts ? [...userPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : []),
    [userPosts]
  );

  const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      {/* Heading + Create Button */}
      <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
          My Requirements
        </h2>
        <button
          onClick={() => {
            setEditingReq(null);
            setEditingData(null);
            setShowForm((prev) => !prev);
          }}
          className="bg-primaryColor hover:bg-opacity-90 text-white px-5 py-2 rounded text-sm font-medium transition flex items-center gap-2"
        >
          {showForm && !editingReq ? (
            <>Cancel</>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Create Requirement
            </>
          )}
        </button>
      </div>

      {/* Collapsible Form */}
      {showForm && (
        <CreateRequirementForm
          initialData={editingData}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Loading & Error */}
      {isLoading && (
        <p className="text-contentColor dark:text-contentColor-dark py-8 text-center">
          Loading your requirements...
        </p>
      )}

      {error && (
        <p className="text-red-500 py-8 text-center">Failed to load requirements.</p>
      )}

      {/* Requirements Table */}
      {!isLoading && !error && (
        <div className="overflow-auto">
          {sortedPosts.length > 0 ? (
            <table className="w-full text-left text-nowrap">
              <thead className="text-sm md:text-base text-blackColor dark:text-blackColor-dark bg-lightGrey5 dark:bg-whiteColor-dark leading-1.8 md:leading-1.8">
                <tr>
                  <th className="px-5px py-10px md:px-5">#</th>
                  <th className="px-5px py-10px md:px-5">Title</th>
                  <th className="px-5px py-10px md:px-5">Subject</th>
                  <th className="px-5px py-10px md:px-5">Status</th>
                  <th className="px-5px py-10px md:px-5">Applicants</th>
                  <th className="px-5px py-10px md:px-5">Date</th>
                  <th className="px-5px py-10px md:px-5">Actions</th>
                </tr>
              </thead>
              <tbody className="text-size-13 md:text-base text-contentColor dark:text-contentColor-dark font-normal">
                {sortedPosts.map((req, i) => {
                  const badge = STATUS_BADGE[req.status] || { label: req.status, cls: "bg-gray text-white" };
                  return (
                    <tr
                      key={req.id}
                      className={`leading-1.8 md:leading-1.8 ${i % 2 === 0 ? "" : "bg-lightGrey5 dark:bg-whiteColor-dark"}`}
                    >
                      <td className="px-5px py-10px md:px-5">{i + 1}</td>
                      <td className="px-5px py-10px md:px-5">
                        <Link
                          href={`/parent-requirements/${req.id}`}
                          className="text-blackColor dark:text-blackColor-dark font-bold hover:text-primaryColor transition"
                        >
                          {req.title || req.subject}
                        </Link>
                      </td>
                      <td className="px-5px py-10px md:px-5">{req.subject}</td>
                      <td className="px-5px py-10px md:px-5">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badge.cls}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-5px py-10px md:px-5">
                        <button
                          onClick={() => setSelectedMailbox(req.id)}
                          className="relative flex items-center gap-1 text-sm font-semibold text-primaryColor hover:text-primaryColor/80 transition"
                        >
                          <i className="icofont-envelope text-lg" />
                          {applicantCounts[req.id] > 0 && (
                            <span className="absolute -top-2.5 -right-3 bg-red-500 text-white text-[10px] min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center font-bold leading-none">
                              {applicantCounts[req.id]}
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="px-5px py-10px md:px-5">{formatDate(req.createdAt)}</td>
                      <td className="px-5px py-10px md:px-5">
                        <div className="dashboard__button__group flex gap-2">
                          <Link
                            href={`/parent-requirements/${req.id}`}
                            className="flex items-center gap-1 text-sm font-bold text-whiteColor hover:text-primaryColor bg-primaryColor hover:bg-whiteColor dark:hover:bg-whiteColor-dark border border-primaryColor h-30px px-14px leading-30px justify-center rounded-md my-5px"
                          >
                            <i className="icofont-eye"></i>
                            View
                          </Link>
                          <button
                            onClick={() => handleEdit(req)}
                            disabled={loadingFull}
                            className="flex items-center gap-1 text-sm font-bold text-whiteColor hover:text-primaryColor bg-blue hover:bg-whiteColor dark:hover:bg-whiteColor-dark border border-blue h-30px px-14px leading-30px justify-center rounded-md my-5px disabled:opacity-50"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(req)}
                            className="flex items-center gap-1 text-sm font-bold text-whiteColor hover:text-secondaryColor bg-secondaryColor hover:bg-whiteColor dark:hover:bg-whiteColor-dark border border-secondaryColor h-30px px-14px leading-30px justify-center rounded-md my-5px"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-contentColor dark:text-contentColor-dark text-center py-10">
              No requirements found.
            </p>
          )}
        </div>
      )}

      {/* Mailbox Modal */}
      {selectedMailbox && (
        <MailboxModal
          requirementId={selectedMailbox}
          requirementTitle={selectedRequirement?.title || selectedRequirement?.subject}
          onClose={() => setSelectedMailbox(null)}
        />
      )}
    </div>
  );
};

export default ParentRequirementStatus;
