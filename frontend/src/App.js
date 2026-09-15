// Recovered from the surviving frontend bundle; local variable names are not original.
import { jsxRuntime, uj, IU, Dk, lk, St, rx } from './runtime.js';
import { AuthProvider } from './AuthProvider.js';
import { GuestRoute } from './GuestRoute.js';
import { AdminLogin } from './AdminLogin.js';
import { AdminLayout } from './AdminLayout.js';
import { AdminDashboard } from './AdminDashboard.js';
import { AdminUsers } from './AdminUsers.js';
import { AdminCategories } from './AdminCategories.js';
import { AdminStorybooks } from './AdminStorybooks.js';
import { AdminVideos } from './AdminVideos.js';
import { AdminElearnings } from './AdminElearnings.js';
import { AdminQuizzes } from './AdminQuizzes.js';
import { AdminQuizResults } from './AdminQuizResults.js';
import { AdminBanners } from './AdminBanners.js';
import { LoginPage } from './LoginPage.js';
import { RegisterPage } from './RegisterPage.js';
import { ForgotPasswordPage } from './ForgotPasswordPage.js';
import { ResetPasswordPage } from './ResetPasswordPage.js';
import { VerifyEmailPage } from './VerifyEmailPage.js';
import { SiteLayout } from './SiteLayout.js';
import { HomePage } from './HomePage.js';
import { StorybooksPage } from './StorybooksPage.js';
import { StorybookDetail } from './StorybookDetail.js';
import { VideosPage } from './VideosPage.js';
import { VideoDetail } from './VideoDetail.js';
import { ElearningsPage } from './ElearningsPage.js';
import { ElearningDetail } from './ElearningDetail.js';
import { QuizzesPage } from './QuizzesPage.js';
import { QuizPage } from './QuizPage.js';
import { MyResultsPage } from './MyResultsPage.js';
import { ResultDetail } from './ResultDetail.js';
import { StoryQuizHistory } from './StoryQuizHistory.js';
import { MyFlashcardsPage } from './MyFlashcardsPage.js';
import { ProfilePage } from './ProfilePage.js';
import { AISettings } from './AISettings.jsx';
import { Classrooms, ClassroomDetail, ClassroomAssignment, TeacherAccounts } from './Classrooms.jsx';
function App() {
  return jsxRuntime.jsx(uj, {
    client: IU,
    children: jsxRuntime.jsx(AuthProvider, {
      children: jsxRuntime.jsx(Dk, {
        children: jsxRuntime.jsxs(lk, {
          children: [jsxRuntime.jsx(St, {
            path: "/admin/login",
            element: jsxRuntime.jsx(GuestRoute, {
              redirectTo: "/admin",
              children: jsxRuntime.jsx(AdminLogin, {})
            })
          }), jsxRuntime.jsxs(St, {
            path: "/admin",
            element: jsxRuntime.jsx(AdminLayout, {}),
            children: [jsxRuntime.jsx(St, {
              path: "classes", element: jsxRuntime.jsx(Classrooms, {})
            }), jsxRuntime.jsx(St, {
              path: "teachers", element: jsxRuntime.jsx(TeacherAccounts, {})
            }), jsxRuntime.jsx(St, {
              index: !0,
              element: jsxRuntime.jsx(AdminDashboard, {})
            }), jsxRuntime.jsx(St, {
              path: "users",
              element: jsxRuntime.jsx(AdminUsers, {})
            }), jsxRuntime.jsx(St, {
              path: "categories",
              element: jsxRuntime.jsx(AdminCategories, {})
            }), jsxRuntime.jsx(St, {
              path: "storybooks",
              element: jsxRuntime.jsx(AdminStorybooks, {})
            }), jsxRuntime.jsx(St, {
              path: "videos",
              element: jsxRuntime.jsx(AdminVideos, {})
            }), jsxRuntime.jsx(St, {
              path: "elearnings",
              element: jsxRuntime.jsx(AdminElearnings, {})
            }), jsxRuntime.jsx(St, {
              path: "quizzes",
              element: jsxRuntime.jsx(AdminQuizzes, {})
            }), jsxRuntime.jsx(St, {
              path: "quiz-results",
              element: jsxRuntime.jsx(AdminQuizResults, {})
            }), jsxRuntime.jsx(St, {
              path: "ai-settings", element: jsxRuntime.jsx(AISettings, {})
            }), jsxRuntime.jsx(St, {
              path: "banners",
              element: jsxRuntime.jsx(AdminBanners, {})
            })]
          }), jsxRuntime.jsx(St, {
            path: "/login",
            element: jsxRuntime.jsx(GuestRoute, {
              redirectTo: "/",
              children: jsxRuntime.jsx(LoginPage, {})
            })
          }), jsxRuntime.jsx(St, {
            path: "/register",
            element: jsxRuntime.jsx(GuestRoute, {
              redirectTo: "/",
              children: jsxRuntime.jsx(RegisterPage, {})
            })
          }), jsxRuntime.jsx(St, {
            path: "/forgot-password",
            element: jsxRuntime.jsx(ForgotPasswordPage, {})
          }), jsxRuntime.jsx(St, {
            path: "/reset-password/:token",
            element: jsxRuntime.jsx(ResetPasswordPage, {})
          }), jsxRuntime.jsx(St, {
            path: "/verify-email/:token",
            element: jsxRuntime.jsx(VerifyEmailPage, {})
          }), jsxRuntime.jsxs(St, {
            element: jsxRuntime.jsx(SiteLayout, {}),
            children: [jsxRuntime.jsx(St, {
              path: "/classes", element: jsxRuntime.jsx(Classrooms, {})
            }), jsxRuntime.jsx(St, {
              path: "/classes/:id", element: jsxRuntime.jsx(ClassroomDetail, {})
            }), jsxRuntime.jsx(St, {
              path: "/assignments/:id", element: jsxRuntime.jsx(ClassroomAssignment, {})
            }), jsxRuntime.jsx(St, {
              path: "/",
              element: jsxRuntime.jsx(HomePage, {})
            }), jsxRuntime.jsx(St, {
              path: "/storybooks",
              element: jsxRuntime.jsx(StorybooksPage, {})
            }), jsxRuntime.jsx(St, {
              path: "/storybooks/:id",
              element: jsxRuntime.jsx(StorybookDetail, {})
            }), jsxRuntime.jsx(St, {
              path: "/videos",
              element: jsxRuntime.jsx(VideosPage, {})
            }), jsxRuntime.jsx(St, {
              path: "/video/:id",
              element: jsxRuntime.jsx(VideoDetail, {})
            }), jsxRuntime.jsx(St, {
              path: "/elearnings",
              element: jsxRuntime.jsx(ElearningsPage, {})
            }), jsxRuntime.jsx(St, {
              path: "/elearning/:id",
              element: jsxRuntime.jsx(ElearningDetail, {})
            }), jsxRuntime.jsx(St, {
              path: "/quizzes",
              element: jsxRuntime.jsx(QuizzesPage, {})
            }), jsxRuntime.jsx(St, {
              path: "/quiz/:id",
              element: jsxRuntime.jsx(QuizPage, {})
            }), jsxRuntime.jsx(St, {
              path: "/my-results",
              element: jsxRuntime.jsx(MyResultsPage, {})
            }), jsxRuntime.jsx(St, {
              path: "/my-results/:id",
              element: jsxRuntime.jsx(ResultDetail, {})
            }), jsxRuntime.jsx(St, {
              path: "/my-quiz-history",
              element: jsxRuntime.jsx(StoryQuizHistory, {})
            }), jsxRuntime.jsx(St, {
              path: "/my-flashcards",
              element: jsxRuntime.jsx(MyFlashcardsPage, {})
            }), jsxRuntime.jsx(St, {
              path: "/profile",
              element: jsxRuntime.jsx(ProfilePage, {})
            })]
          }), jsxRuntime.jsx(St, {
            path: "*",
            element: jsxRuntime.jsx(rx, {
              to: "/",
              replace: !0
            })
          })]
        })
      })
    })
  });
}
export { App };
