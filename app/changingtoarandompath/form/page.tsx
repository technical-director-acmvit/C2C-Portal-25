"use client";
import LampDemo from "@/app/components/form/ui/lamp";
import { useState } from "react";
import InputBox from "@/app/components/form/InputBox";
import ImgBox from "@/app/components/form/ImgBox";
import { useDashStore } from "@/app/stores/dash";
import ViewBox from "@/app/components/form/ViewBox";
import { updateTeam, UpdateTeamInput } from "@/app/actions/update_team";
import { getRepoInstallationIdAction, tagRepoAction } from "@/app/actions/github";
import UpdateSuccessModal from "@/app/components/form/update-success-modal";

export function FormContent() {
    // const view = useDashStore((s) => s.view);
    const data = useDashStore((s) => s.dashboard);
    // const error = useDashStore((s) => s.error);
    const team = data?.team ?? null;
    const track = data?.track ?? null;
    const currentUser = data?.user ?? null;
    const teammatesRef = data?.teammates;

    const teamName = team?.name ?? "";
  type Teammate = { name?: string; college_name?: string };
  const teammates = teammatesRef ? (teammatesRef as Teammate[]).map((t: Teammate) => t.name ?? t.college_name ?? "") : [];
    const chosenTrack = track?.title ?? "";
  const projectTitle = data?.submission?.title ?? "";
  const projectDesc = data?.submission?.description ?? "";
  // const projectPpt = data?.submission?.ppt_url ?? "";
    
    // Form state for editable fields
  const [githubLink, setGithubLink] = useState<string>(team?.github_url ?? "");
  const [figmaLink, setFigmaLink] = useState<string>(team?.figma_url ?? "");
  const [googleDriveLink, setGoogleDriveLink] = useState<string>(team?.other ?? "");
  const [githubError, setGithubError] = useState<string>("");
  const [driveError, setDriveError] = useState<string>("");
    const [techStackInput, setTechStackInput] = useState<string>("");
  const resolvedTechStack = (team?.tech_stack ?? []) as string[] | Record<string, unknown>;
    const [techStackTags, setTechStackTags] = useState<string[]>(
      resolvedTechStack
        ? Array.isArray(resolvedTechStack)
          ? (resolvedTechStack as string[])
          : Object.keys(resolvedTechStack)
        : []
    );

    console.log("Initial tech stack:", techStackTags, team?.tech_stack);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showUpdatedModal, setShowUpdatedModal] = useState(false);

  // const techStackList: string[] = Array.isArray(resolvedTechStack) ? resolvedTechStack : Object.keys(resolvedTechStack);

    // Submit handler
    const validateGithub = (url: string) => {
      if (!url) return "";
      try {
        const u = new URL(url);
        const hostOk = /(^|\.)github\.com$/i.test(u.hostname);
        // basic path must include user/repo or org/repo optionally with further paths
        const pathOk = /^\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(\/.*)?$/.test(u.pathname);
        return hostOk && pathOk ? "" : "Enter a valid GitHub repository URL";
      } catch {
        return "Enter a valid GitHub URL";
      }
    };


    const validateDrive = (url: string) => {
      if (!url) return "";
      try {
        const u = new URL(url);
        const hostOk = /(^|\.)drive\.google\.com$|(^|\.)docs\.google\.com$/i.test(u.hostname);
        // Accept common Drive link formats
        const pathOk = /^(\/drive\/folders\/|\/file\/d\/|\/uc\?|\/presentation\/d\/|\/document\/d\/|\/spreadsheets\/d\/)/.test(u.pathname + (u.search || ""));
        return hostOk && pathOk ? "" : "Enter a valid Google Drive link";
      } catch {
        return "Enter a valid Google Drive URL";
      }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Validate before submit
            const gErr = validateGithub(githubLink);
            const dErr = validateDrive(googleDriveLink);
            setGithubError(gErr);
            setDriveError(dErr);
            if (gErr || dErr) {
              setIsSubmitting(false);
              return;
            }
            const input: UpdateTeamInput = {
                githubUrl: githubLink || null,
                figmaUrl: figmaLink || null,
                other: googleDriveLink || null,
                techStack: techStackTags.length > 0 ? techStackTags : null,
            };
            await updateTeam(input);

            // Best-effort: if a GitHub repo URL was provided, attempt to ensure the Code2Create topic exists
            if (githubLink) {
              try {
                // parse owner/repo from URL
                let owner: string | null = null;
                let repo: string | null = null;
                try {
                  const u = new URL(githubLink);
                  const parts = u.pathname.replace(/^\//, '').split('/');
                  if (parts.length >= 2) {
                    owner = parts[0];
                    repo = parts[1].replace(/\.git$/i, '');
                  }
                } catch {
                  const m = githubLink.match(/github\.com\/(.+?)\/(.+?)(?:$|\?|#|\/)/i);
                  if (m) {
                    owner = m[1];
                    repo = m[2].replace(/\.git$/i, '');
                  }
                }
                if (owner && repo) {
                  const iid = await getRepoInstallationIdAction(owner, repo);
                  console.log("[C2C] Post-save: installation id", iid);
                  if (iid) {
                    console.log("[C2C] Post-save: attempting to tag", { owner, repo, iid });
                    const res = await tagRepoAction(iid, owner, repo).catch(() => ({ ok: false } as const));
                    console.log("[C2C] Post-save tagging result:", res);
                  } else {
                    console.log("[C2C] Post-save: installation id not found; skipping tag");
                  }
                }
              } catch {}
            }
            setShowUpdatedModal(true);
        } catch (error) {
            console.error("Failed to update team:", error);
            alert("Failed to update team. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const tracksConst = [
      { text: "I Can Do It Better", img: "/img1.png", title: "I Can Do It Better" },
      { text: "AI Solutions", img: "/img2.png", title: "AI Solutions" },
      { text: "Art Attack", img: "/img3.png", title: "Art Attack" },
      { text: "Game Over", img: "/img4.png", title: "Game Over" },
      { text: "Digital Dawn", img: "/img5.png", title: "Digital Dawn" },
    ];

    const initialSelected = tracksConst.findIndex((t) => t.title === chosenTrack);
  // const [newTech] = useState<string>("");

    interface TechTagProps {
        tech: string;
        onRemove: () => void;
    }

    const TechTag: React.FC<TechTagProps> = ({ tech, onRemove }) => {
        return (
        <div className="bg-[#858a88] text-black px-3 py-1 rounded-md flex items-center gap-2 text-sm opacity-80">
            {tech}
            <button onClick={onRemove} className="ml-2 text-black hover:text-black">×</button>
        </div>
        );
    };

  const handleTechStackKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const val = techStackInput.trim();
            if (!val) return;
            if (!techStackTags.includes(val)) {
                setTechStackTags((t) => [...t, val]);
            }
            setTechStackInput("");
            e.preventDefault();
        }
    };

    const removeTechTag = (tag: string) => {
        setTechStackTags((t) => t.filter((x) => x !== tag));
    };

    // Check if tech stack is empty/null initially
    const isTechStackEmpty = !team?.tech_stack || 
        (Array.isArray(team.tech_stack) && team.tech_stack.length === 0) ||
        (!Array.isArray(team.tech_stack) && Object.keys(team.tech_stack).length === 0);

  return (
    <>
      <div className="w-full flex justify-center pt-[5px] px-4">
        
        <div className="w-full max-w-6xl text-white">
          {/* <h2 className="pt-[100px] text-[24px] sm:text-[32px] md:text-[40px] text-center font-bold px-4">
            Ideas are the new currency—spend yours here!
          </h2> */}
          <h2 className="pt-[40px] sm:pt-[60px] md:pt-[80px] text-[40px] sm:text-[56px] md:text-[70px] text-center font-bold px-4">
            Idea View
          </h2>

          <div className="w-full max-w-4xl mx-auto mt-[30px] sm:mt-[50px] p-2 sm:p-4 font-bold relative">
          
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/form/Mask group (2).svg"
              alt=""
              aria-hidden="true"
              className="hidden xl:block absolute pointer-events-none select-none -right-24 lg:-right-32 xl:-right-40 top-1/2 -translate-y-1/2 w-32 lg:w-40 xl:w-48 z-0"
            />
            <h2 className="text-[24px] sm:text-[28px] md:text-[30px] text-left mb-6 sm:mb-8">Team Type</h2>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <button
                className={`flex-1 h-16 sm:h-20 rounded-2xl border-2 font-medium text-base sm:text-lg transition-all cursor-not-allowed ${
                  currentUser?.internal 
                    ? "bg-[rgba(57,75,67,1)] border-emerald-500 text-white" 
                    : "bg-[rgba(6,15,11,1)] border-emerald-500 text-[#a6a3a3]"
                }`}
                disabled
              >
                Internal Participant
              </button>
              <button
                className={`flex-1 h-16 sm:h-20 rounded-2xl border-2 font-medium text-base sm:text-lg transition-all cursor-not-allowed ${
                  !currentUser?.internal 
                    ? "bg-[rgba(57,75,67,1)] border-emerald-500 text-white" 
                    : "bg-[rgba(6,15,11,1)] border-emerald-500 text-[#a6a3a3]"
                }`}
                disabled
              >
                External Participant
              </button>
            </div>
          </div>

          <div className="w-full max-w-4xl mx-auto mt-[20px] p-2 sm:p-4 font-bold">
            <h2 className="text-[24px] sm:text-[28px] md:text-[30px] text-left mb-6 sm:mb-8">Team Name</h2>
            <div className="flex w-full">
              <ViewBox
                data={teamName}
                readOnly
              />
            </div>
          </div>

          <div className="w-full max-w-4xl mx-auto mt-[20px] p-2 sm:p-4 font-bold relative">
           
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/form/Mask group (3).svg"
              alt=""
              aria-hidden="true"
              className="hidden xl:block absolute pointer-events-none select-none -left-24 lg:-left-32 xl:-left-80 top-1/2 -translate-y-1/2 w-32 lg:w-40 xl:w-48 z-0"
            />
            <h2 className="text-[24px] sm:text-[28px] md:text-[30px] text-left mb-3">Team Members</h2>
            <div className="flex w-full flex-col gap-2">
              {teammates.length > 0 ? (
                Array.from({ length: teammates.length }).map((_, i) => (
                  <ViewBox
                    key={i}
                    data={teammates[i] ?? ""}
                    readOnly
                  />
                ))
              ) : (
                <div className="w-full h-20 bg-neutral-950 rounded-2xl border border-gray-600 flex items-center justify-center">
                  <div className="text-gray-400 text-lg font-medium">
                    No team members found
                  </div>
                </div>
              )}
            </div>
          </div>

            <div className="w-full max-w-5xl mx-auto mt-[20px] py-6 sm:py-10 p-2 sm:p-4 font-bold relative">
        
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/form/Mask group (4).svg"
                alt=""
                aria-hidden="true"
                className="hidden xl:block absolute pointer-events-none select-none -left-24 lg:-left-32 xl:-left-40 top-1/2 -translate-y-1/2 w-32 lg:w-40 xl:w-48 z-0"
              />
              <h2 className="text-[24px] sm:text-[28px] md:text-[30px] text-left mb-6 sm:mb-8">Tracks</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                {tracksConst.slice(0, 3).map((track, index) => (
                  <ImgBox
                    key={track.title}
                    text={track.text}
                    img={track.img}
                    title={track.title}
                    selected={index === initialSelected}
                    onClick={() => {}}
                  />
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-none sm:max-w-[66.67%] mx-auto">
                {tracksConst.slice(3, 5).map((track, index) => (
                  <ImgBox
                    key={track.title}
                    text={track.text}
                    img={track.img}
                    title={track.title}
                    selected={(index + 3) === initialSelected}
                    onClick={() => {}}
                  />
                ))}
              </div>
            </div>

            <div className="w-full max-w-4xl mx-auto p-2 sm:p-4 font-bold">
              <h2 className="text-[24px] sm:text-[28px] md:text-[30px] text-left mb-3">Project Title</h2>
              <div className="flex w-full">
                <ViewBox
                  data={projectTitle}
                  readOnly
                />
              </div>
            </div>

            <div className="w-full max-w-4xl mx-auto mt-[20px] p-2 sm:p-4 font-bold">
              <h2 className="text-[24px] sm:text-[28px] md:text-[30px] text-left mb-3">Project Description</h2>
              <div className="flex w-full">
                <ViewBox
                  data={projectDesc}
                  readOnly
                />
              </div>
            </div>

            <div className="w-full max-w-4xl mx-auto mt-[20px] p-2 sm:p-4 font-bold relative">
              {/* Right side decorative SVG */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/form/Mask group (5).svg"
                alt=""
                aria-hidden="true"
                className="hidden xl:block absolute pointer-events-none select-none -right-24 lg:-right-32 xl:-right-40 top-1/3 -translate-y-1/3 w-32 lg:w-40 xl:w-48 z-0"
              />
              <h2 className="text-[24px] sm:text-[28px] md:text-[30px] text-left mb-3">Tech Stack</h2>
              <div className="w-full flex flex-col items-center gap-4">
                {/* Search input for tech stack */}
                <div className="w-full max-w-[757px] h-14 bg-neutral-700 rounded-2xl border border-neutral-600 flex items-center px-4 gap-3">
                  <input
                    className={`flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none ${!isTechStackEmpty ? 'cursor-not-allowed' : ''}`}
                    placeholder="Find your tech stack..."
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    onKeyDown={handleTechStackKeyDown}
                    disabled={!isTechStackEmpty}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/form/search.svg"
                    alt="Search"
                    width={20}
                    height={20}
                    className="opacity-60"
                  />
                </div>

                {/* Selected tech stack container */}
                <div className="w-full max-w-[757px] h-28 bg-neutral-950 rounded-2xl border border-green-400 p-4 overflow-y-auto">
                  {techStackTags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {techStackTags.map((tech) => (
                        <TechTag key={tech} tech={tech} onRemove={() => removeTechTag(tech)} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">No tech stack selected - add some above!</div>
                  )}
                </div>
              </div>
            </div>

            {/* Idea Submission Section (temporarily disabled)
            <div className="w-full max-w-4xl mx-auto mt-[20px] p-2 sm:p-4 font-bold">
              <div className="w-full">
                <h2 className="text-[24px] sm:text-[28px] md:text-[30px] text-left mb-3 text-white">Idea Submission</h2>
                <p className="text-zinc-500 text-lg sm:text-xl mb-6 sm:mb-8">Download the template PPT, fill in your idea details, and upload your completed file here.</p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  
                  <label htmlFor="file-upload" className="cursor-pointer flex-1">
                    <div className="h-20 bg-neutral-950 rounded-2xl border border-green-400 hover:border-green-300 transition-colors flex items-center justify-center px-4">
                      <div className="text-center text-neutral-500 text-sm sm:text-lg font-medium">
                        {uploadedFile ? uploadedFile.name : "Upload Idea in a PPT/PDF format. File should be under 5MB..."}
                      </div>
                    </div>
                  </label>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="w-full sm:w-20 h-20 bg-neutral-950 rounded-2xl border border-green-400 hover:border-green-300 transition-colors flex items-center justify-center">
                      
                      <img
                        src="/form/upload.svg"
                        alt="Upload"
                        width={32}
                        height={32}
                        className="opacity-80 hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </label>
                </div>

                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.ppt,.pptx"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                
                <button
                  onClick={handleDownloadTemplate}
                  className="w-full sm:w-60 h-12 bg-neutral-950 rounded-2xl border border-green-400 hover:border-green-300 transition-colors flex items-center justify-center mb-4"
                >
                  <div className="text-zinc-500 text-lg font-bold hover:text-zinc-400 transition-colors">Download Template</div>
                </button>

                {uploadStatus && (
                  <div className="w-full text-center text-sm text-green-400 mb-4">
                    {uploadStatus}
                  </div>
                )}
              </div>
            </div>
            */}

            {/* <div className="w-[60%] mx-auto mt-[20px] p-2 font-bold">
              <h2 className="text-[30px] text-left mb-3">Your Idea</h2>
              <button
                type="button"
                className={`bg-emerald-600 h-[87px] text-white px-6 py-2 rounded-lg hover:bg-emerald-700 ${!projectPpt ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={async () => {
                  if (!projectPpt) return;
                  try {
                    const res = await fetch(projectPpt);
                    if (!res.ok) {
                      window.open(projectPpt, "_blank", "noopener,noreferrer");
                      return;
                    }
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    const filename = projectPpt.split("/").pop() || "submission.ppt";
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                  } catch (e) {
                    // fallback to opening the URL
                    window.open(projectPpt, "_blank", "noopener,noreferrer");
                  }
                }}
                disabled={!projectPpt}
              >
                Download your submission PPT
              </button>
            </div> */}

            <div className="w-full max-w-4xl mx-auto mt-[20px] p-2 sm:p-4 font-bold">
              <h2 className="text-[24px] sm:text-[28px] md:text-[30px] text-left mb-3">GitHub Link (if any)</h2>
              <div className="flex w-full items-center gap-2">
                {team?.github_url == "" ? (
                  <InputBox
                    placeholder="Upload GitHub Link..."
                    value={githubLink}
                    onChange={(e) => {
                      setGithubLink(e.target.value);
                    }}
                    onBlur={() => setGithubError(validateGithub(githubLink))}
                    invalid={!!githubError}
                    className=""
                  />
                ) : (
                    <ViewBox
                      data={githubLink}
                      readOnly
                    />
                )}
                {githubError && (
                  <span className="text-red-400 text-sm font-normal mt-2">{githubError}</span>
                )}
              </div>
            </div>

            <div className="w-full max-w-4xl mx-auto mt-[20px] p-2 sm:p-4 font-bold">
              <h2 className="text-[24px] sm:text-[28px] md:text-[30px] text-left mb-3">Figma Link (if any)</h2>
              <div className="flex w-full items-center gap-2">
                {team?.figma_url == "" ? (
                    <InputBox
                        placeholder="Upload Figma Link..."
                        value={figmaLink}
                        onChange={(e) => setFigmaLink(e.target.value)}
                    />
                ) : (
                    <ViewBox
                      data={figmaLink}
                      readOnly
                    />
                )}
              </div>
            </div>

            <div className="w-full max-w-4xl mx-auto mt-[20px] p-2 sm:p-4 font-bold mb-20">
              <h2 className="text-[24px] sm:text-[28px] md:text-[30px] text-left mb-3">
                Google Drive Link (if any)
              </h2>
              <div className="flex w-full items-center gap-2">
                {team?.other == "" ? (
                  <InputBox
                    placeholder="Upload Google Drive Link..."
                    value={googleDriveLink}
                    onChange={(e) => setGoogleDriveLink(e.target.value)}
                    onBlur={() => setDriveError(validateDrive(googleDriveLink))}
                    invalid={!!driveError}
                  />
                ) : (
                    <ViewBox
                      data={googleDriveLink}
                      readOnly
                    />
                )}
                {driveError && (
                  <span className="text-red-400 text-sm font-normal mt-2">{driveError}</span>
                )}
              </div>
            </div>

            {(team?.github_url == "" || team?.figma_url == "" || team?.other == "" || isTechStackEmpty) ? (
            <div className="w-full max-w-4xl mx-auto mt-[20px] p-2 sm:p-4 font-bold mb-20">
              <div className="flex justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !!githubError || !!driveError}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white font-bold py-4 px-6 sm:px-8 rounded-lg text-lg sm:text-xl transition-colors w-full sm:w-auto"
                >
                  {isSubmitting ? "Updating..." : "Update Team"}
                </button>
              </div>
            </div> ) : null}
        </div>
      </div>
      <UpdateSuccessModal
        isOpen={showUpdatedModal}
        onClose={() => setShowUpdatedModal(false)}
      />
    </>
  );
}
export default function Home() {

  return (
    <LampDemo>
      <FormContent />
    </LampDemo>
  );
}
