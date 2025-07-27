import React from "react";

const FamilyPortalPreview = () => (
  <div className="min-h-full flex flex-col items-center justify-center p-8 bg-gray-50">
    <h1 className="text-2xl font-bold text-[#239d62] mb-4">
      Family Member Portal (Preview)
    </h1>
    <div className="w-full max-w-2xl bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-2">Senior Citizen: John Doe</h2>
      <div className="mb-4">
        <p className="text-gray-700 font-medium">Well-being Updates:</p>
        <ul className="list-disc ml-6 text-gray-600">
          <li>Overall mood: Positive</li>
          <li>Physical activity: Regular</li>
          <li>Social engagement: High</li>
        </ul>
      </div>
      <div className="mb-4">
        <p className="text-gray-700 font-medium">Recent Achievements:</p>
        <ul className="list-disc ml-6 text-gray-600">
          <li>Completed art therapy session</li>
          <li>Won memory game challenge</li>
        </ul>
      </div>
      <div className="mb-4">
        <p className="text-gray-700 font-medium">Alerts & Suggestions:</p>
        <ul className="list-disc ml-6 text-red-500">
          <li>No concerning trends detected</li>
        </ul>
        <ul className="list-disc ml-6 text-gray-600 mt-2">
          <li>Encourage video calls with grandchildren</li>
          <li>Share family photos regularly</li>
        </ul>
      </div>
      <div className="mt-6 text-gray-400 text-sm text-center">
        This is a static preview. The full portal will include interactive
        features and real-time updates.
      </div>
    </div>
  </div>
);

export default FamilyPortalPreview;
