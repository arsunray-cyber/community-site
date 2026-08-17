export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Welcome to Our Community Portal
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Connect with fellow community members, stay updated with announcements, 
          and access important resources all in one place.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/register"
            className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Join Our Community
          </a>
          <a
            href="/announcements"
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-50 transition-colors"
          >
            View Announcements
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Member Directory</h3>
          <p className="text-gray-600">
            Connect with other approved community members. Search by name, occupation, or location.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">News & Updates</h3>
          <p className="text-gray-600">
            Stay informed with the latest community announcements, events, and important updates.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Financial Transparency</h3>
          <p className="text-gray-600">
            Access financial audits and reports. We believe in complete transparency for our community.
          </p>
        </div>
      </div>

      {/* Trustees Preview */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Community Leadership</h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Our dedicated trustees work tirelessly to serve the community. Reach out to them for any queries or concerns.
        </p>
        <div className="text-center">
          <a
            href="/trustees"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-md font-medium hover:bg-purple-700 transition-colors"
          >
            Meet Our Trustees
          </a>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 rounded-lg p-8 md:p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Register today and become part of our growing community. Your registration will be reviewed by our administrator.
        </p>
        <a
          href="/register"
          className="inline-block bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
        >
          Register Now
        </a>
      </div>
    </div>
  );
}
