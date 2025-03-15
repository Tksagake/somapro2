"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import LayoutWrapper from "@/app/components/LayoutWrapper";
import React from "react";

export default function CreateGradeAndStreamPage() {
  const router = useRouter();
  const [grade, setGrade] = useState({ grade_name: "" });
  const [streams, setStreams] = useState([{ stream_name: "" }]);
  const [grades, setGrades] = useState([]);
  const [allStreams, setAllStreams] = useState([]);
  const [editingGrade, setEditingGrade] = useState(null);
  const [editingStream, setEditingStream] = useState(null);

  const handleChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleStreamChange = (index, e) => {
    const { name, value } = e.target;
    const newStreams = [...streams];
    newStreams[index] = { ...newStreams[index], [name]: value };
    setStreams(newStreams);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGrade) {
        // Update existing grade
        const { error: gradeError } = await supabase
          .from("grades")
          .update({ grade_name: grade.grade_name })
          .eq("id", editingGrade.id);

        if (gradeError) throw gradeError;
      } else {
        // Insert new grade
        const { data: gradeData, error: gradeError } = await supabase
          .from("grades")
          .insert([{ grade_name: grade.grade_name }])
          .select();

        if (gradeError) throw gradeError;

        const gradeId = gradeData[0].id;

        // Insert streams with the grade ID
        const streamsWithGrade = streams.map((stream) => ({
          ...stream,
          grade_id: gradeId,
        }));

        const { error: streamError } = await supabase
          .from("streams")
          .insert(streamsWithGrade);

        if (streamError) throw streamError;
      }

      alert("Grade and streams updated successfully!");
      fetchGradesAndStreams();
      setEditingGrade(null);
      setGrade({ grade_name: "" });
      setStreams([{ stream_name: "" }]);
    } catch (error) {
      console.error("Error submitting data:", error.message || error);
      alert("Error submitting data: " + (error.message || "Unknown error occurred."));
    }
  };

  const fetchGradesAndStreams = async () => {
    try {
      const { data: gradesData, error: gradesError } = await supabase
        .from("grades")
        .select("*");

      if (gradesError) throw gradesError;
      setGrades(gradesData);

      const { data: streamsData, error: streamsError } = await supabase
        .from("streams")
        .select("*");

      if (streamsError) throw streamsError;
      setAllStreams(streamsData);
    } catch (error) {
      console.error("Error fetching data:", error.message || error);
    }
  };

  const handleEditGrade = (grade) => {
    setEditingGrade(grade);
    setGrade({ grade_name: grade.grade_name });
  };

  const handleDeleteGrade = async (gradeId) => {
    try {
      const { error } = await supabase.from("grades").delete().eq("id", gradeId);
      if (error) throw error;
      alert("Grade deleted successfully!");
      fetchGradesAndStreams();
    } catch (error) {
      console.error("Error deleting grade:", error.message || error);
      alert("Error deleting grade: " + (error.message || "Unknown error occurred."));
    }
  };

  const handleEditStream = (stream) => {
    setEditingStream(stream);
    setStreams([{ stream_name: stream.stream_name }]);
  };

  const handleDeleteStream = async (streamId) => {
    try {
      const { error } = await supabase.from("streams").delete().eq("id", streamId);
      if (error) throw error;
      alert("Stream deleted successfully!");
      fetchGradesAndStreams();
    } catch (error) {
      console.error("Error deleting stream:", error.message || error);
      alert("Error deleting stream: " + (error.message || "Unknown error occurred."));
    }
  };

  useEffect(() => {
    fetchGradesAndStreams();
  }, []);

  return (
    <LayoutWrapper>
      <div className="p-6 max-w-lg mx-auto bg-gray-100 min-h-screen text-gray-800">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Create Grade and Streams</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Grade Section */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Grade</h2>
            <input
              type="text"
              name="grade_name"
              placeholder="Grade Name"
              className="w-full p-2 border rounded bg-white text-black"
              onChange={handleChange(setGrade)}
              value={grade.grade_name}
              required
            />
          </div>

          {/* Streams Section */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Streams</h2>
            {streams.map((stream, index) => (
              <input
                key={index}
                type="text"
                name="stream_name"
                placeholder="Stream Name"
                className="w-full p-2 border rounded bg-white text-black"
                onChange={(e) => handleStreamChange(index, e)}
                value={stream.stream_name}
                required
              />
            ))}
            <button
              type="button"
              onClick={() => setStreams([...streams, { stream_name: "" }])}
              className="w-full bg-gray-300 text-gray-800 p-2 rounded"
            >
              Add Stream
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
          >
            {editingGrade ? "Update Grade" : "Submit"}
          </button>
        </form>

        {/* Table for Grades and Streams */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Grades and Streams</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Grade Name</th>
                <th className="border border-gray-300 p-2">Stream Name</th>
                <th className="border border-gray-300 p-2">Grade Actions</th>
                <th className="border border-gray-300 p-2">Stream Actions</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => (
                <React.Fragment key={grade.id}>
                  {allStreams
                    .filter((stream) => stream.grade_id === grade.id)
                    .map((stream) => (
                      <tr key={stream.id}>
                        <td className="border border-gray-300 p-2">{grade.grade_name}</td>
                        <td className="border border-gray-300 p-2">{stream.stream_name}</td>
                        <td className="border border-gray-300 p-2">
                          <button
                            onClick={() => handleEditGrade(grade)}
                            className="text-blue-500 mr-2"
                          >
                            Edit Grade
                          </button>
                          <button
                            onClick={() => handleDeleteGrade(grade.id)}
                            className="text-red-500"
                          >
                            Delete Grade
                          </button>
                        </td>
                        <td className="border border-gray-300 p-2">
                          <button
                            onClick={() => handleEditStream(stream)}
                            className="text-blue-500 mr-2"
                          >
                            Edit Stream
                          </button>
                          <button
                            onClick={() => handleDeleteStream(stream.id)}
                            className="text-red-500"
                          >
                            Delete Stream
                          </button>
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </LayoutWrapper>
  );
}
