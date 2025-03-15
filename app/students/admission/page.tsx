"use client";

import { ChangeEvent, useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import LayoutWrapper from "@/app/components/LayoutWrapper";

export default function AdmissionPage() {
  const router = useRouter();
  const [student, setStudent] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "Male",
    nationality: "",
    county: "",
    religion: "",
    email: "",
    phone_number: "",
    admission_number: "",
    id_number: "",
    kcpe_index_number: "",
    marital_status: "Single",
    passport_photo_url: "",
    id_document_url: "",
  });

  const [grades, setGrades] = useState<{ id: string; grade_name: string }[]>([]);
  const [streams, setStreams] = useState<{ id: string; stream_name: string; grade_id: string }[]>([]);
  const [subjects, setSubjects] = useState<{ id: string; subject_name: string }[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedStream, setSelectedStream] = useState<string>("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [guardians, setGuardians] = useState([{
    guardian_name: "",
    phone_number_1: "",
    phone_number_2: "",
    email: "",
    residence: "",
    relationship: "Father",
  }]);

  const [medicalRecord, setMedicalRecord] = useState({
    blood_group: "",
    allergies: "",
    medical_conditions: "",
    medical_certificate_url: "",
  });

  // Fetch grades and subjects on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch grades
        const { data: gradesData, error: gradesError } = await supabase
          .from("grades")
          .select("id, grade_name");

        if (gradesError) throw gradesError;
        setGrades(gradesData || []);

        // Fetch subjects
        const { data: subjectsData, error: subjectsError } = await supabase
          .from("subjects")
          .select("id, subject_name");

        if (subjectsError) throw subjectsError;
        setSubjects(subjectsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Fetch streams when a grade is selected
  useEffect(() => {
    const fetchStreams = async () => {
      if (selectedGrade) {
        try {
          const { data: streamsData, error: streamsError } = await supabase
            .from("streams")
            .select("id, stream_name, grade_id")
            .eq("grade_id", selectedGrade);

          if (streamsError) throw streamsError;
          setStreams(streamsData || []);
        } catch (error) {
          console.error("Error fetching streams:", error);
        }
      }
    };

    fetchStreams();
  }, [selectedGrade]);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setStudent((prevStudent) => ({ ...prevStudent, [name]: value }));
  };

  const handleGradeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedGrade(e.target.value);
    setSelectedStream(""); // Reset stream when grade changes
  };

  const handleStreamChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedStream(e.target.value);
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId) // Deselect if already selected
        : [...prev, subjectId] // Select if not already selected
    );
  };

  const handleGuardianChange = (index: number, e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newGuardians = [...guardians];
    newGuardians[index] = { ...newGuardians[index], [name]: value };
    setGuardians(newGuardians);
  };

  const handleMedicalChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setMedicalRecord((prevRecord) => ({ ...prevRecord, [name]: value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    // Insert student data
    const { data: studentData, error: studentError } = await supabase
      .from("students")
      .insert([student])
      .select();

    if (studentError) {
      console.error("Error admitting student:", studentError);
      alert("Error admitting student.");
      return;
    }

    const studentId = studentData[0].id;

    // Insert grade and stream
    if (selectedGrade && selectedStream) {
      const { error: streamError } = await supabase
        .from("student_streams")
        .insert([{ student_id: studentId, stream_id: selectedStream }]);

      if (streamError) {
        console.error("Error inserting stream:", streamError);
      }
    }

    // Insert subjects
    const subjectInserts = selectedSubjects.map((subjectId) => ({
      student_id: studentId,
      subject_id: subjectId,
    }));
    const { error: subjectError } = await supabase
      .from("student_subjects")
      .insert(subjectInserts);

    if (subjectError) {
      console.error("Error inserting subjects:", subjectError);
    }

    // Insert guardians
    const guardianInserts = guardians.map((guardian) => ({
      student_id: studentId,
      ...guardian,
    }));
    const { error: guardianError } = await supabase
      .from("parents_guardians")
      .insert(guardianInserts);

    if (guardianError) {
      console.error("Error inserting guardians:", guardianError);
    }

    // Insert medical records
    const { error: medicalError } = await supabase
      .from("medical_records")
      .insert([{ student_id: studentId, ...medicalRecord }]);

    if (medicalError) {
      console.error("Error inserting medical records:", medicalError);
    }

    alert("Student admitted successfully!");
    router.push("/students");
  };

  return (
    <LayoutWrapper>
      <div className="p-6 max-w-4xl mx-auto bg-gray-100 min-h-screen text-gray-800">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Admit New Student</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Details */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Student Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Student details inputs */}
              {/* ... (same as before) */}
            </div>
          </div>

          {/* Class (Grade and Stream) */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Class</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="grade"
                className="w-full p-2 border rounded bg-white text-black"
                onChange={handleGradeChange}
                value={selectedGrade}
                required
              >
                <option value="">Select Grade</option>
                {grades.map((grade) => (
                  <option key={grade.id} value={grade.id}>
                    {grade.grade_name}
                  </option>
                ))}
              </select>
              <select
                name="stream"
                className="w-full p-2 border rounded bg-white text-black"
                onChange={handleStreamChange}
                value={selectedStream}
                required
              >
                <option value="">Select Stream</option>
                {streams.map((stream) => (
                  <option key={stream.id} value={stream.id}>
                    {stream.stream_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subjects */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Subjects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((subject) => (
                <label key={subject.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="subject"
                    value={subject.id}
                    checked={selectedSubjects.includes(subject.id)}
                    onChange={() => handleSubjectChange(subject.id)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span>{subject.subject_name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Guardians */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Guardians</h2>
            {guardians.map((guardian, index) => (
              <div key={index} className="space-y-4 mb-4">
                {/* Guardian inputs */}
                {/* ... (same as before) */}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setGuardians([...guardians, {
                guardian_name: "",
                phone_number_1: "",
                phone_number_2: "",
                email: "",
                residence: "",
                relationship: "Father",
              }])}
              className="w-full bg-gray-300 text-gray-800 p-2 rounded"
            >
              Add Guardian
            </button>
          </div>

          {/* Medical Records */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Medical Records</h2>
            {/* Medical records inputs */}
            {/* ... (same as before) */}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
          >
            Admit Student
          </button>
        </form>
      </div>
    </LayoutWrapper>
  );
}