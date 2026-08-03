import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Hastalar", path: "/hastalar" },
    { name: "Hekimler", path: "/hekimler" },
    { name: "Randevular", path: "/randevular" },
    { name: "Tedaviler", path: "/tedaviler" },
    { name: "Stok", path: "/stok" },
    { name: "Reçeteler", path: "/receteler" },
  ];

  return (
    <aside className="w-64 h-screen bg-teal-700 text-white flex flex-col p-4">
      <h1 className="text-xl font-bold mb-8">Diş Kliniği</h1>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg transition ${
                isActive ? "bg-teal-900" : "hover:bg-teal-600"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}