import Image from "next/image";
import type { Project } from "@/data/projects";

export function ProjectVisual({ project }: { project: Project }) {
  if (project.image) return <Image src={project.image} alt={`${project.name} — actual project interface`} fill sizes="(max-width: 768px) 92vw, 58vw" className="project-screenshot" />;
  if (project.visual === "library") return <div className="source-visual">
    <div className="source-sidebar"><span className="source-logo">L<span>/</span></span><span>EXPLORER</span><div>▾ php_system</div>{["Book", "Borrow", "components", "Return.php", "Report.php", "library_db.sql"].map(x => <span key={x} className={x === "Book" ? "file active" : "file"}>{x.includes(".") ? "◇" : "▸"} {x}</span>)}<span className="sidebar-bottom">PHP / SQL</span></div>
    <div className="source-editor"><div className="source-tab">Book/getbook.php <span>×</span></div><div className="source-lines mono">{[
      ["01", "<?php"], ["02", "require_once '../db.php';"], ["03", ""], ["04", "$stmt->bind_param(\"s\", $book_id);"], ["05", "$stmt->execute();"], ["06", "$result = $stmt->get_result();"], ["07", ""], ["08", "// Return book data as JSON"], ["09", "header('Content-Type: application/json');"], ["10", "echo json_encode($row);"],
    ].map(([num, code]) => <div key={num}><span className="line-number">{num}</span><span>{code}</span></div>)}</div><div className="source-note">PUBLIC SOURCE / SELECTED EXCERPTS<span>Book/getbook.php · Full implementation on GitHub.</span></div></div>
  </div>;
  return <div className="experiments-visual"><div className="experiment-browser"><span>● ● ●</span><span>frontend / studies</span><span>+</span></div><div className="experiment-main"><span className="mono">04 / CREATIVE IMAGE EFFECT</span><div className="experiment-geometry" aria-hidden="true"><div /><div /><div /><div /></div><p>Small ideas.<br /><em>Real experiments.</em></p><span className="mono">HTML + CSS + CURIOSITY</span></div><span className="experiment-caption mono">CONCEPT VISUAL / VIEW ORIGINAL SOURCE</span></div>;
}
