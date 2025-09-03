import React from "react";

// Lazy load components for better performance
export const Login = React.lazy(() => import("./Login"));
export const Dashboard = React.lazy(() => import("./Dashboard"));
export const Members = React.lazy(() => import("./Members"));
export const NewMember = React.lazy(() => import("./NewMember"));
export const EditMember = React.lazy(() => import("./EditMember"));
export const MemberDetails = React.lazy(() => import("./MemberDetails"));
export const Centers = React.lazy(() => import("./Centers"));
export const CenterDetails = React.lazy(() => import("./CenterDetails"));
export const EditCenter = React.lazy(() => import("./EditCenter"));
export const AddCenter = React.lazy(() => import("./AddCenter"));
export const Activities = React.lazy(() => import("./Activities"));
export const NewActivity = React.lazy(() => import("./NewActivity"));
export const ActivityDetails = React.lazy(() => import("./ActivityDetails"));
export const EditActivity = React.lazy(() => import("./EditActivity"));
export const EvaluationMasterList = React.lazy(() =>
  import("./EvaluationMasterList")
);
export const NewDomain = React.lazy(() => import("./NewDomain"));
export const EditDomain = React.lazy(() => import("./EditDomain"));
export const SessionList = React.lazy(() => import("./SessionList"));
export const Attendance = React.lazy(() => import("./Attendance"));
export const AttendanceDetails = React.lazy(() =>
  import("./AttendanceDetails")
);
export const Evaluations = React.lazy(() => import("./Evaluations"));
export const AllCenterReport = React.lazy(() =>
  import("./reports/AllCenterReport")
);
export const CenterReport = React.lazy(() => import("./reports/CenterReport"));
export const MemberReport = React.lazy(() => import("./reports/MemberReport"));
export const OxfordHappiness = React.lazy(() => import("./OxfordHappiness"));
export const AddOxfordHappiness = React.lazy(() =>
  import("./AddOxfordHappiness")
);
export const EditOxfordHappiness = React.lazy(() =>
  import("./EditOxfordHappiness")
);
export const Casp19 = React.lazy(() => import("./Casp19"));
export const AddCasp19 = React.lazy(() => import("./AddCasp19"));
export const EditCasp19 = React.lazy(() => import("./EditCasp19"));
export const Moca = React.lazy(() => import("./Moca"));
export const AddMoca = React.lazy(() => import("./AddMoca"));
export const EditMoca = React.lazy(() => import("./EditMoca"));
export const DomainDetails = React.lazy(() => import("./DomainDetails"));
export const SessionDetails = React.lazy(() => import("./SessionDetails"));
export const EditSession = React.lazy(() => import("./EditSession"));
export const NewEvaluation = React.lazy(() => import("./NewEvaluation"));
export const EditEvaluation = React.lazy(() => import("./EditEvaluation"));
export const EvaluationDetails = React.lazy(() =>
  import("./EvaluationDetails")
);
export const PerformanceTrends = React.lazy(() =>
  import("./PerformanceTrends")
);
export const UpcomingFeatures = React.lazy(() => import("./UpcomingFeatures"));
export const CaregiverDashboardPreview = React.lazy(() =>
  import("./CaregiverDashboardPreview")
);
export const FamilyPortalPreview = React.lazy(() =>
  import("./FamilyPortalPreview")
);
export const CrossCommunityInsights = React.lazy(() =>
  import("./CrossCommunityInsights")
);
export const MemberDomainProgress = React.lazy(() =>
  import("./MemberDomainProgress")
);
export const TechEnabledActivities = React.lazy(() =>
  import("./TechEnabledActivities")
);
export const TechCommunicationAndSessions = React.lazy(() =>
  import("./TechCommunicationAndSessions")
);
export const SessionActivityOverview = React.lazy(() =>
  import("./SessionActivityOverview")
);
export const ExpansionModule = React.lazy(() => import("./ExpansionModule"));
export const AutomatedDataAnalysis = React.lazy(() =>
  import("./AutomatedDataAnalysis")
);
export const ClickHereGames = React.lazy(() => import("./ClickHereGames"));
export const ManageAdmins = React.lazy(() => import("./ManageAdmins"));
