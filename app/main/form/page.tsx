"use client";
import LampDemo from "@/app/components/form/ui/lamp";
import { useState } from "react";
import InputBox from "@/app/components/form/InputBox";
import ImgBox from "@/app/components/form/ImgBox";
import { useDashStore } from "@/app/stores/dash";
import ViewBox from "@/app/components/form/ViewBox";
import { updateTeam, UpdateTeamInput } from "@/app/actions/update_team";

export function FormContent() {
    const view = useDashStore((s) => s.view);
    const data = useDashStore((s) => s.dashboard);
    const error = useDashStore((s) => s.error);
    const team = data?.team ?? null;
    const track = data?.track ?? null;
    const currentUser = data?.user ?? null;
    const teammatesRef = data?.teammates;

    const teamName = team?.name ?? "";
    const teammates = teammatesRef ? teammatesRef.map((t) => t.name ?? t.college_name) : [];
    const chosenTrack = track?.title ?? "";
    const projectTitle = data?.submission?.title ?? "";
    const projectDesc = data?.submission?.description ?? "";
    const projectPpt = data?.submission?.ppt_url ?? "";
    
    // Form state for editable fields
    const [githubLink, setGithubLink] = useState(team?.github_url ?? "");
    const [figmaLink, setFigmaLink] = useState(team?.figma_url ?? "");
    const [googleDriveLink, setGoogleDriveLink] = useState(team?.other ?? "");
    const [techStackInput, setTechStackInput] = useState<string>("");
    const [techStackTags, setTechStackTags] = useState<string[]>(
        team?.tech_stack
            ? Array.isArray(team.tech_stack)
                ? (team.tech_stack as string[])
                : Object.keys(team.tech_stack)
            : []
    );

    console.log("Initial tech stack:", techStackTags, team?.tech_stack);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const techStackList: string[] = team?.tech_stack
      ? Array.isArray(team.tech_stack)
        ? (team.tech_stack as string[])
        : Object.keys(team.tech_stack)
      : [];

      console.log("project title:", projectTitle);

    // Submit handler
    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const input: UpdateTeamInput = {
                githubUrl: githubLink || null,
                figmaUrl: figmaLink || null,
                other: googleDriveLink || null,
                techStack: techStackTags.length > 0 ? techStackTags : null,
            };
            await updateTeam(input);
            alert("Team updated successfully!");
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
    const [newTech] = useState<string>("");

    interface TechTagProps {
        tech: string;
        onRemove: () => void;
    }

    const TechTag: React.FC<TechTagProps> = ({ tech, onRemove }) => {
        return (
        <div className="bg-gray-600 text-white px-3 py-1 rounded-md flex items-center gap-2 text-sm opacity-80">
            {tech}
            <button onClick={onRemove} className="ml-2 text-red-400 hover:text-red-300">×</button>
        </div>
        );
    };

    const handleTechStackKeyDown = (e: any) => {
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
      <div className="w-full flex justify-center pt-[275px]">
        
        <div className="w-[90%] text-white">
          <h2 className="pt-[100px] text-[40px] text-center font-bold">
            Ideas are the new currency—spend yours here!
          </h2>
          <h2 className="pt-[80px] text-[70px] text-center font-bold">
            Idea Submission
          </h2>

          <div className="w-[60%] h-[250px] mx-auto mt-[50px] p-2 font-bold">
            <h2 className="text-[30px] text-left mb-8">Team Type</h2>
            <div className="flex justify-between">
              <button
                className={`text-[22px] px-4 py-2 w-[344px] h-[87px] rounded-lg border-2 ${currentUser?.internal ? "bg-[rgba(57,75,67,1)] border-emerald-500" : "bg-[rgba(6,15,11,1)] border-emerald-500"} text-white`}
              >
                Internal Participant
              </button>
              <button
                className={`text-[22px] px-4 py-2 w-[344px] h-[87px] rounded-lg border-2 ${!currentUser?.internal ? "bg-[rgba(57,75,67,1)] border-emerald-500" : "bg-[rgba(6,15,11,1)] border-emerald-500"} text-white`}
              >
                External Participant
              </button>
            </div>
          </div>

          <div className="w-[60%] h-[250px] mx-auto mt-[20px] p-2 font-bold">
            <h2 className="text-[30px] text-left mb-8">Team Name</h2>
            <div className="flex w-full">
              <ViewBox
                data={teamName}
                readOnly
              />
            </div>
          </div>

          <div className="w-[60%] h-[75vh] mx-auto mt-[20px] p-2 font-bold">
            <h2 className="text-[30px] text-left mb-3">Team Members</h2>
            <div className="flex w-full flex-col gap-2">
                {Array.from({ length: teammates.length }).map((_, i) => (
                  <ViewBox
                    key={i}
                    data={teammates[i] ?? ""}
                    readOnly
                  />
                ))
              }
            </div>
          </div>

            <div className="w-[60%] mx-auto mt-[20px] py-10 font-bold">
              <h2 className="text-[30px] text-left mb-3">Tracks</h2>
              <div className="grid grid-cols-6 gap-4 h-[600px]">
                {initialSelected >= 0 ? (
                  <ImgBox
                    key={tracksConst[initialSelected].title}
                    text={tracksConst[initialSelected].text}
                    img={tracksConst[initialSelected].img}
                    title={tracksConst[initialSelected].title}
                    selected={true}
                    onClick={() => {}}
                  />
                ) : (
                  <div className="text-gray-400 text-center col-span-6">
                    No track selected
                  </div>
                )}
              </div>
            </div>

            <div className="w-[60%] mx-auto p-2 font-bold">
              <h2 className="text-[30px] text-left mb-3">Project Title</h2>
              <div className="flex w-full">
                <ViewBox
                  data={projectTitle}
                  readOnly
                />
              </div>
            </div>

            <div className="w-[60%] mx-auto mt-[20px] p-2 font-bold">
              <h2 className="text-[30px] text-left mb-3">Project Description</h2>
              <div className="flex w-full">
                <ViewBox
                  data={projectDesc}
                  readOnly
                />
              </div>
            </div>

            <div className="w-[60%] mx-auto mt-[20px] p-2 font-bold">
              <h2 className="text-[30px] text-left mb-3">Tech Stack</h2>
            <div className="w-full">
                {isTechStackEmpty || techStackTags.length === 0 ? (
                    <>
                        <input
                            className="w-full h-[58px] bg-[rgba(6,15,11,1)] border-2 border-emerald-500 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400"
                            placeholder="Type a tech and press Enter..."
                            value={techStackInput}
                            onChange={(e) => setTechStackInput(e.target.value)}
                            onKeyDown={handleTechStackKeyDown}
                        />
                        {techStackTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {techStackTags.map((tech) => (
                                    <TechTag key={tech} tech={tech} onRemove={() => removeTechTag(tech)} />
                                ))}
                            </div>
                        )}
                        {techStackTags.length === 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                <div className="text-gray-400">No tech stack provided - add some!</div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {techStackTags.map((tech) => (
                            <TechTag key={tech} tech={tech} onRemove={() => {}} />
                        ))}
                    </div>
                )}
            </div>
            </div>

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

            <div className="w-[60%] mx-auto mt-[20px] p-2 font-bold">
              <h2 className="text-[30px] text-left mb-3">GitHub Link (if any)</h2>
              <div className="flex w-[99%] items-center gap-2">
                {team?.github_url == "" ? (
                  <InputBox
                    placeholder="Upload GitHub Link..."
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                  />
                ) : (
                    <ViewBox
                      data={githubLink}
                      readOnly
                    />
                )}
              </div>
            </div>

            <div className="w-[60%] mx-auto mt-[20px] p-2 font-bold">
              <h2 className="text-[30px] text-left mb-3">Figma Link (if any)</h2>
              <div className="flex w-[99%] items-center gap-2">
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

            <div className="w-[60%] mx-auto mt-[20px] p-2 font-bold mb-20">
              <h2 className="text-[30px] text-left mb-3">
                Google Drive Link (if any)
              </h2>
              <div className="flex w-[99%] items-center gap-2">
                {team?.other == "" ? (
                  <InputBox
                    placeholder="Upload Google Drive Link..."
                    value={googleDriveLink}
                    onChange={(e) => setGoogleDriveLink(e.target.value)}
                  />
                ) : (
                    <ViewBox
                      data={googleDriveLink}
                      readOnly
                    />
                )}
              </div>
            </div>

            {(team?.github_url == "" || team?.figma_url == "" || team?.other == "" || isTechStackEmpty) ? (
            <div className="w-[60%] mx-auto mt-[20px] p-2 font-bold mb-20">
              <div className="flex justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
                >
                  {isSubmitting ? "Updating..." : "Update Team"}
                </button>
              </div>
            </div> ) : null}
        </div>
      </div>
  );
}
export default function Home() {

  return (
    <LampDemo>
      <FormContent />
    </LampDemo>
  );
}