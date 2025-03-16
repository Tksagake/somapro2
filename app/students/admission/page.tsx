"use client";

import { ChangeEvent, useEffect, useState } from "react";
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

  const [subjects, setSubjects] = useState<{ subject_id: string }[]>([]);
  const [streams, setStreams] = useState<{ stream_id: string }[]>([]);
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

  const [availableSubjects, setAvailableSubjects] = useState<{ id: string; subject_name: string }[]>([]);
  const [availableGrades, setAvailableGrades] = useState<{ id: string; grade_name: string }[]>([]);
  const [availableStreams, setAvailableStreams] = useState<{ id: string; stream_name: string }[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStudent((prevStudent) => ({ ...prevStudent, [name]: value }));
  };

  const handleSubjectChange = (index: number, e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    const newSubjects = [...subjects];
    newSubjects[index] = { subject_id: value };
    setSubjects(newSubjects);
  };

  const handleStreamChange = (index: number, e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    const newStreams = [...streams];
    newStreams[index] = { stream_id: value };
    setStreams(newStreams);
  };

  const handleGuardianChange = (index: number, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newGuardians = [...guardians];
    newGuardians[index] = { ...newGuardians[index], [name]: value };
    setGuardians(newGuardians);
  };

  const handleMedicalChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMedicalRecord((prevRecord) => ({ ...prevRecord, [name]: value }));
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const filePath = `${fieldName}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('edu360-uploads').upload(filePath, file);

    if (error) {
      console.error("Error uploading file:", error.message);
      alert("Error uploading file.");
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('edu360-uploads').getPublicUrl(filePath);
    const fileUrl = publicUrl;
    if (fieldName === "medical_certificate_url") {
      setMedicalRecord((prevRecord) => ({ ...prevRecord, medical_certificate_url: fileUrl }));
    } else {
      setStudent((prevStudent) => ({ ...prevStudent, [fieldName]: fileUrl }));
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      // Insert student data
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .insert([student])
        .select();

      if (studentError) throw new Error(studentError.message || "Error admitting student");

      const studentId = studentData[0].id;

      // Insert subjects
      const subjectInserts = subjects.map((subject) => ({
        student_id: studentId,
        subject_id: subject.subject_id,
      }));
      const { error: subjectError } = await supabase
        .from("student_subjects")
        .insert(subjectInserts);

      if (subjectError) throw new Error(subjectError.message || "Error inserting subjects");

      // Insert streams
      const streamInserts = streams.map((stream) => ({
        student_id: studentId,
        stream_id: stream.stream_id,
      }));
      const { error: streamError } = await supabase
        .from("student_streams")
        .insert(streamInserts);

      if (streamError) throw new Error(streamError.message || "Error inserting streams");

      // Insert guardians
      const guardianInserts = guardians.map((guardian) => ({
        student_id: studentId,
        ...guardian,
      }));
      const { error: guardianError } = await supabase
        .from("parents_guardians")
        .insert(guardianInserts);

      if (guardianError) throw new Error(guardianError.message || "Error inserting guardians");

      // Insert medical records
      const { error: medicalError } = await supabase
        .from("medical_records")
        .insert([{ student_id: studentId, ...medicalRecord }]);

      if (medicalError) throw new Error(medicalError.message || "Error inserting medical records");

      alert("Student admitted successfully!");
      router.push("/students");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error submitting data:", error.message);
      } else {
        console.error("Error submitting data:", error);
      }
      alert("Error submitting data: " + ((error as Error).message || "Unknown error occurred."));
    }
  };

  const fetchAvailableOptions = async () => {
    try {
      const { data: subjectsData, error: subjectsError } = await supabase
        .from("subjects")
        .select("id, subject_name");

      if (subjectsError) throw subjectsError;
      setAvailableSubjects(subjectsData);

      const { data: gradesData, error: gradesError } = await supabase
        .from("grades")
        .select("id, grade_name");

      if (gradesError) throw gradesError;
      setAvailableGrades(gradesData);

      const { data: streamsData, error: streamsError } = await supabase
        .from("streams")
        .select("id, stream_name");

      if (streamsError) throw streamsError;
      setAvailableStreams(streamsData);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching available options:", error.message);
      } else {
        console.error("Error fetching available options:", error);
      }
    }
  };

  useEffect(() => {
    fetchAvailableOptions();
  }, []);

  return (
    <LayoutWrapper>
      <div className="p-6 mx-auto bg-gray-100 min-h-screen text-gray-800 max-w-4xl">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Admit New Student</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student Details */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Student Details</h2>
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                className="w-full p-2 border rounded bg-white text-black"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="middle_name"
                placeholder="Middle Name"
                className="w-full p-2 border rounded bg-white text-black"
                onChange={handleChange}
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                className="w-full p-2 border rounded bg-white text-black"
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="date_of_birth"
                className="w-full p-2 border rounded bg-white text-black"
                onChange={handleChange}
                required
              />
              <select
                name="gender"
                className="w-full p-2 border rounded bg-white text-black"
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="text"
                name="nationality"
                placeholder="Nationality"
                className="w-full p-2 border rounded bg-white text-black"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="county"
                placeholder="County"
                className="w-full p-2 border rounded bg-white text-black"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="religion"
                placeholder="Religion"
                className="w-full p-2 border rounded bg-white text-black"
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full p-2 border rounded bg-white text-black"
                onChange={handleChange}
              />
              <input
                type="text"
                name="phone_number"
                placeholder="Phone Number"
                className="w-full p-2 border rounded bg-white text-black"
                onChange={handleChange}
              />
              <input
                type="text"
                name="admission_number"
                placeholder="Admission Number"
                className="w-full p-2 border rounded bg-white text-black"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="id_number"
                placeholder="ID Number"
                className="w-full p-2 border rounded bg-white text-black"
                onChange={handleChange}
              />
              <input
                type="text"
                name="kcpe_index_number"
                placeholder="KCPE Index Number"
                className="w-full p-2 border rounded bg-white text-black"
                onChange={handleChange}
              />
              <select
                name="marital_status"
                className="w-full p-2 border rounded bg-white text-black"
                onChange={handleChange}
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Attachments */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Attachments</h2>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  name="passport_photo_url"
                  placeholder="Passport Photo URL"
                  className="w-full p-2 border rounded bg-white text-black"
                  value={student.passport_photo_url}
                  readOnly
                />
                <label className="bg-blue-500 text-white p-2 rounded cursor-pointer">
                  Upload
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "passport_photo_url")}
                  />
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  name="id_document_url"
                  placeholder="ID Document URL"
                  className="w-full p-2 border rounded bg-white text-black"
                  value={student.id_document_url}
                  readOnly
                />
                <label className="bg-blue-500 text-white p-2 rounded cursor-pointer">
                  Upload
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "id_document_url")}
                  />
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  name="medical_certificate_url"
                  placeholder="Medical Certificate URL"
                  className="w-full p-2 border rounded bg-white text-black"
                  value={medicalRecord.medical_certificate_url}
                  readOnly
                />
                <label className="bg-blue-500 text-white p-2 rounded cursor-pointer">
                  Upload
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "medical_certificate_url")}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Subjects */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Subjects</h2>
            {subjects.map((subject, index) => (
              <select
                key={index}
                name="subject_id"
                className="w-full p-2 border rounded bg-white text-black"
                onChange={(e) => handleSubjectChange(index, e)}
                required
              >
                <option value="">Select Subject</option>
                {availableSubjects.map((subj) => (
                  <option key={subj.id} value={subj.id}>
                    {subj.subject_name}
                  </option>
                ))}
              </select>
            ))}
            <button
              type="button"
              onClick={() => setSubjects([...subjects, { subject_id: "" }])}
              className="w-full bg-gray-300 text-gray-800 p-2 rounded"
            >
              Add Subject
            </button>
          </div>

          {/* Streams and Grade */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Streams and Grade</h2>
            <select
              name="grade_id"
              className="w-full p-2 border rounded bg-white text-black"
              onChange={handleChange}
              required
            >
              <option value="">Select Grade</option>
              {availableGrades.map((grade) => (
                <option key={grade.id} value={grade.id}>
                  {grade.grade_name}
                </option>
              ))}
            </select>
            {streams.map((stream, index) => (
              <select
                key={index}
                name="stream_id"
                className="w-full p-2 border rounded bg-white text-black"
                onChange={(e) => handleStreamChange(index, e)}
                required
              >
                <option value="">Select Stream</option>
                {availableStreams.map((strm) => (
                  <option key={strm.id} value={strm.id}>
                    {strm.stream_name}
                  </option>
                ))}
              </select>
            ))}
            <button
              type="button"
              onClick={() => setStreams([...streams, { stream_id: "" }])}
              className="w-full bg-gray-300 text-gray-800 p-2 rounded"
            >
              Add Stream
            </button>
          </div>

          {/* Guardians */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Guardians</h2>
            {guardians.map((guardian, index) => (
              <div key={index} className="space-y-2">
                <input
                  type="text"
                  name="guardian_name"
                  placeholder="Guardian Name"
                  className="w-full p-2 border rounded bg-white text-black"
                  onChange={(e) => handleGuardianChange(index, e)}
                  required
                />
                <input
                  type="text"
                  name="phone_number_1"
                  placeholder="Phone Number 1"
                  className="w-full p-2 border rounded bg-white text-black"
                  onChange={(e) => handleGuardianChange(index, e)}
                  required
                />
                <input
                  type="text"
                  name="phone_number_2"
                  placeholder="Phone Number 2"
                  className="w-full p-2 border rounded bg-white text-black"
                  onChange={(e) => handleGuardianChange(index, e)}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-2 border rounded bg-white text-black"
                  onChange={(e) => handleGuardianChange(index, e)}
                />
                <input
                  type="text"
                  name="residence"
                  placeholder="Residence"
                  className="w-full p-2 border rounded bg-white text-black"
                  onChange={(e) => handleGuardianChange(index, e)}
                />
                <select
                  name="relationship"
                  className="w-full p-2 border rounded bg-white text-black"
                  onChange={(e) => handleGuardianChange(index, e)}
                >
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Sponsor">Sponsor</option>
                </select>
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
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Medical Records</h2>
            <select
              name="blood_group"
              className="w-full p-2 border rounded bg-white text-black"
              onChange={handleMedicalChange}
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
            <input
              type="text"
              name="allergies"
              placeholder="Allergies"
              className="w-full p-2 border rounded bg-white text-black"
              onChange={handleMedicalChange}
            />
            <input
              type="text"
              name="medical_conditions"
              placeholder="Medical Conditions"
              className="w-full p-2 border rounded bg-white text-black"
              onChange={handleMedicalChange}
            />
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