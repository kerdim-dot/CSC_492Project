import SideBar from "../Components/Sidebar";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { formatClassUrlCode, normalizeClassCode } from "../tools/classRoutes";
import "../filtered_class_page.css";

function normalizeClass(rawClass) {
    const classId =
        rawClass.classId ??
        rawClass.class_id ??
        rawClass.id;

    const header =
        rawClass.header ??
        rawClass.code ??
        rawClass.classCode ??
        "";

    const title =
        rawClass.title ??
        rawClass.name ??
        rawClass.className ??
        "";

    return {
        ...rawClass,

        id: Number(classId),
        classId: Number(classId),

        header,
        code: header,

        title,
        name: title,

        credits: Number(rawClass.credits ?? 0),

        isActive: Boolean(
            rawClass.isActive ??
            rawClass.is_active ??
            rawClass.active ??
            true
        ),

        isElective: Boolean(
            rawClass.isElective ??
            rawClass.is_elective ??
            rawClass.elective
        ),

        isForeignLanguage: Boolean(
            rawClass.isForeignLanguage ??
            rawClass.is_foreign_language ??
            rawClass.foreignLanguage
        ),

        isCSMajor: Boolean(
            rawClass.isCSMajor ??
            rawClass.is_cs_major ??
            rawClass.isRequiredComputerScienceMajor
        ),

        isCSMinor: Boolean(
            rawClass.isCSMinor ??
            rawClass.is_cs_minor ??
            rawClass.isRequiredComputerScienceMinor
        ),

        isMultiPlatformMajor: Boolean(
            rawClass.isMultiPlatformMajor ??
            rawClass.is_multi_platform_major ??
            rawClass.isRequiredMultiPlatformMajor
        ),

        category:
            rawClass.category ??
            rawClass.courseCategory ??
            rawClass.requirementCategory ??
            rawClass.requirementType ??
            "",
    };
}

function categoryMatches(course, expected) {
    const category = String(course.category ?? "").toLowerCase();

    return (
        category === expected ||
        category.includes(expected)
    );
}

function isCscUpperLevel(course) {
    const normalized = normalizeClassCode(course.header);
    const match = normalized.match(/^CSC(\d{3})$/);

    if (!match) return false;

    const courseNumber = Number(match[1]);

    return courseNumber >= 300 && courseNumber < 500;
}

function isElectiveCourse(course) {
    return (
        course.isElective ||
        categoryMatches(course, "elective")
    );
}

function isMinorElectiveCourse(course) {
    return (
        course.isMinorElective ||
        categoryMatches(course, "minor-elective")
    );
}

function isForeignLanguageCourse(course) {
    return (
        course.isForeignLanguage ||
        categoryMatches(course, "foreign-language") ||
        categoryMatches(course, "foreign language")
    );
}

function getPageConfig(pageType) {
    if (pageType === "foreign-language") {
        return {
            title: "Foreign Language Courses",
            subtitle: "Courses marked by the backend as foreign language options.",
            emptyMessage:
                "No foreign language courses were found. The backend needs to mark these with isForeignLanguage, is_foreign_language, or a category/requirementType value.",
            filter: isForeignLanguageCourse,
        };
    }

    if (pageType === "electives") {
        return {
            title: "Electives",
            subtitle: "Courses marked by the backend as elective options.",
            emptyMessage:
                "No electives were found. The backend needs to mark these with isElective, is_elective, or a category/requirementType value.",
            filter: isElectiveCourse,
        };
    }

    if (pageType === "minor-electives") {
        return {
            title: "Minor Electives",
            subtitle: "Courses marked by the backend as minor elective options.",
            emptyMessage:
                "No minor electives were found. The backend needs to mark these with isMinorElective, is_minor_elective, or a category/requirementType value.",
            filter: isMinorElectiveCourse,
        };
    }

    if (pageType === "csc-upper-level") {
        return {
            title: "CSC 300/400 Courses",
            subtitle: "CSC courses numbered from 300 through 499.",
            emptyMessage:
                "No CSC 300/400 courses were found.",
            filter: isCscUpperLevel,
        };
    }

    return {
        title: "Classes",
        subtitle: "Available classes.",
        emptyMessage: "No classes were found.",
        filter: () => true,
    };
}

function FilteredClassPage({ pageType }) {
    const navigate = useNavigate();

    const [rawClasses, setRawClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pageError, setPageError] = useState(null);

    useEffect(() => {
        async function fetchClasses() {
            try {
                setIsLoading(true);
                setPageError(null);

                const response = await axios.get("http://localhost:8080/test/get/classes");

                setRawClasses(response.data ?? []);
            } catch (error) {
                console.error("Failed to fetch classes:", error);
                setPageError(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchClasses();
    }, []);

    const classes = useMemo(() => {
        return rawClasses.map(normalizeClass);
    }, [rawClasses]);

    const pageConfig = getPageConfig(pageType);

    const visibleClasses = useMemo(() => {
        return classes
            .filter((course) => course.isActive)
            .filter(pageConfig.filter)
            .sort((a, b) => {
                return normalizeClassCode(a.header).localeCompare(
                    normalizeClassCode(b.header)
                );
            });
    }, [classes, pageConfig]);

    function navigateToClass(course) {
        navigate(`/classes/${formatClassUrlCode(course.header)}`);
    }

    if (isLoading) {
        return (
            <div className="filtered-class-page-shell">
                <SideBar />

                <main className="filtered-class-page-content">
                    <section className="dashboard-surface filtered-class-surface">
                        <p className="dashboard-surface-subtitle">
                            Loading classes...
                        </p>
                    </section>
                </main>
            </div>
        );
    }

    if (pageError) {
        return (
            <div className="filtered-class-page-shell">
                <SideBar />

                <main className="filtered-class-page-content">
                    <section className="dashboard-surface filtered-class-surface">
                        <h2 className="dashboard-surface-title">
                            Classes failed to load
                        </h2>

                        <p className="dashboard-surface-subtitle">
                            Check that the backend is running and that the class endpoint is available.
                        </p>
                    </section>
                </main>
            </div>
        );
    }

    return (
        <div className="filtered-class-page-shell">
            <SideBar />

            <main className="filtered-class-page-content">
                <section className="dashboard-surface filtered-class-surface">
                    <div className="dashboard-surface-header">
                        <div>
                            <h2 className="dashboard-surface-title">
                                {pageConfig.title}
                            </h2>

                            <p className="dashboard-surface-subtitle">
                                {pageConfig.subtitle}
                            </p>
                        </div>

                        <div className="filtered-class-count-pill">
                            {visibleClasses.length} course
                            {visibleClasses.length === 1 ? "" : "s"}
                        </div>
                    </div>

                    {visibleClasses.length > 0 ? (
                        <div className="filtered-class-grid">
                            {visibleClasses.map((course) => (
                                <button
                                    key={course.classId || course.header}
                                    type="button"
                                    className="filtered-class-card"
                                    onClick={() => navigateToClass(course)}
                                >
                                    <div className="filtered-class-card-top">
                                        <span className="filtered-class-code">
                                            {course.header}
                                        </span>

                                        <span className="filtered-class-credits">
                                            {course.credits
                                                ? `${course.credits} credits`
                                                : "Credits unavailable"}
                                        </span>
                                    </div>

                                    <div className="filtered-class-title">
                                        {course.title || "Untitled class"}
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="filtered-class-empty-state">
                            <h3>No matching courses</h3>
                            <p>{pageConfig.emptyMessage}</p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default FilteredClassPage;