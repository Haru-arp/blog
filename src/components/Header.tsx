import Link from 'next/link';

const Header = () => {
  return (
    <header className="py-6 border-b border-gray-200 mb-8">
      <Link href="/">
        <h1 className="text-3xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
          My Notion Blog
        </h1>
      </Link>
    </header>
  );
};

export default Header;