// Recovered from the surviving frontend bundle; local variable names are not original.
import { useQuery, apiClient, bx, Fs, mw, nn, as, Jl, Qf, jsxRuntime, Tw } from './runtime.js';
function AdminDashboard() {
  const {
      data: t,
      isLoading: e
    } = useQuery({
      queryKey: ["dashboard-stats"],
      queryFn: async () => {
        const [i, r, l, o, d, f, p] = await Promise.all([apiClient.get("/admin/users"), apiClient.get("/admin/users/pending"), apiClient.get("/categories"), apiClient.get("/storybooks"), apiClient.get("/videos"), apiClient.get("/elearnings"), apiClient.get("/quizzes")]);
        return {
          users: {
            total: i.data.users?.length || 0,
            pending: r.data.users?.length || 0
          },
          categories: l.data.categories?.length || 0,
          storybooks: o.data.storybooks?.length || o.data.pagination?.total || 0,
          videos: d.data.videos?.length || d.data.pagination?.total || 0,
          elearnings: f.data.elearnings?.length || f.data.pagination?.total || 0,
          quizzes: p.data.quizzes?.length || p.data.pagination?.total || 0
        };
      }
    }),
    n = [{
      label: "Người dùng",
      value: t?.users.total || 0,
      icon: bx,
      color: "bg-blue-500",
      link: "/admin/users"
    }, {
      label: "Chờ duyệt",
      value: t?.users.pending || 0,
      icon: Fs,
      color: "bg-yellow-500",
      link: "/admin/users?status=pending"
    }, {
      label: "Danh mục",
      value: t?.categories || 0,
      icon: mw,
      color: "bg-green-500",
      link: "/admin/categories"
    }, {
      label: "Storybooks",
      value: t?.storybooks || 0,
      icon: nn,
      color: "bg-purple-500",
      link: "/admin/storybooks"
    }, {
      label: "Videos",
      value: t?.videos || 0,
      icon: as,
      color: "bg-pink-500",
      link: "/admin/videos"
    }, {
      label: "E-Learning",
      value: t?.elearnings || 0,
      icon: Jl,
      color: "bg-indigo-500",
      link: "/admin/elearnings"
    }, {
      label: "Quizzes",
      value: t?.quizzes || 0,
      icon: Qf,
      color: "bg-orange-500",
      link: "/admin/quizzes"
    }];
  return e ? jsxRuntime.jsxs("div", {
    className: "animate-pulse space-y-6",
    children: [jsxRuntime.jsx("div", {
      className: "h-8 w-48 bg-gray-200 rounded"
    }), jsxRuntime.jsx("div", {
      className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
      children: [...Array(7)].map((i, r) => jsxRuntime.jsx("div", {
        className: "h-32 bg-gray-200 rounded-xl"
      }, r))
    })]
  }) : jsxRuntime.jsxs("div", {
    className: "space-y-6",
    children: [jsxRuntime.jsxs("div", {
      className: "flex items-center justify-between",
      children: [jsxRuntime.jsx("h1", {
        className: "text-2xl font-bold text-gray-800",
        children: "Dashboard"
      }), jsxRuntime.jsxs("div", {
        className: "flex items-center gap-2 text-sm text-gray-500",
        children: [jsxRuntime.jsx(Tw, {
          className: "w-4 h-4"
        }), jsxRuntime.jsx("span", {
          children: "Tổng quan hệ thống"
        })]
      })]
    }), jsxRuntime.jsx("div", {
      className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
      children: n.map(i => jsxRuntime.jsx("a", {
        href: i.link,
        className: "bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow",
        children: jsxRuntime.jsxs("div", {
          className: "flex items-center gap-4",
          children: [jsxRuntime.jsx("div", {
            className: `${i.color} p-3 rounded-lg text-white`,
            children: jsxRuntime.jsx(i.icon, {
              className: "w-6 h-6"
            })
          }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("p", {
              className: "text-sm text-gray-500",
              children: i.label
            }), jsxRuntime.jsx("p", {
              className: "text-2xl font-bold text-gray-800",
              children: i.value
            })]
          })]
        })
      }, i.label))
    }), jsxRuntime.jsxs("div", {
      className: "bg-white rounded-xl shadow-sm p-6",
      children: [jsxRuntime.jsx("h2", {
        className: "text-lg font-semibold text-gray-800 mb-4",
        children: "Thao tác nhanh"
      }), jsxRuntime.jsxs("div", {
        className: "grid grid-cols-2 md:grid-cols-4 gap-4",
        children: [jsxRuntime.jsxs("a", {
          href: "/admin/users?status=pending",
          className: "p-4 rounded-lg border border-yellow-200 bg-yellow-50 hover:bg-yellow-100 transition text-center",
          children: [jsxRuntime.jsx(Fs, {
            className: "w-8 h-8 mx-auto text-yellow-600 mb-2"
          }), jsxRuntime.jsx("span", {
            className: "text-sm font-medium text-yellow-800",
            children: "Duyệt người dùng"
          }), t?.users.pending ? jsxRuntime.jsxs("span", {
            className: "block text-xs text-yellow-600 mt-1",
            children: [t.users.pending, " đang chờ"]
          }) : null]
        }), jsxRuntime.jsxs("a", {
          href: "/admin/storybooks/new",
          className: "p-4 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 transition text-center",
          children: [jsxRuntime.jsx(nn, {
            className: "w-8 h-8 mx-auto text-purple-600 mb-2"
          }), jsxRuntime.jsx("span", {
            className: "text-sm font-medium text-purple-800",
            children: "Thêm Storybook"
          })]
        }), jsxRuntime.jsxs("a", {
          href: "/admin/videos/new",
          className: "p-4 rounded-lg border border-pink-200 bg-pink-50 hover:bg-pink-100 transition text-center",
          children: [jsxRuntime.jsx(as, {
            className: "w-8 h-8 mx-auto text-pink-600 mb-2"
          }), jsxRuntime.jsx("span", {
            className: "text-sm font-medium text-pink-800",
            children: "Thêm Video"
          })]
        }), jsxRuntime.jsxs("a", {
          href: "/admin/quizzes/new",
          className: "p-4 rounded-lg border border-orange-200 bg-orange-50 hover:bg-orange-100 transition text-center",
          children: [jsxRuntime.jsx(Qf, {
            className: "w-8 h-8 mx-auto text-orange-600 mb-2"
          }), jsxRuntime.jsx("span", {
            className: "text-sm font-medium text-orange-800",
            children: "Tạo Quiz"
          })]
        })]
      })]
    })]
  });
}
export { AdminDashboard };
