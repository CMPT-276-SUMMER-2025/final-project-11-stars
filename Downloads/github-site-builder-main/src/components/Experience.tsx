

const Experience = () => {
  const education = [{
    school: "Simon Fraser University",
    degree: "Bachelor of Computing Science",
    period: "2023 - Present",
    description: "Activities and societies: Bangladeshi Students' Alliance (Vice President of Communications)",
    link: "https://www.sfu.ca/"
  }, {
    school: "Scholastica School",
    degree: "High School Diploma",
    period: "2018-2022",
    description: "Activities and societies: Model United Nations (Delegate), Class Student Councilor, High School Honors Academic Achievement (11th grade), Active Member of the school Community Service club, Environmental club and Ted-Ed club",
    link: "https://cacdn03.freeli.io/scholastica/index.php"
  }];
  
  const volunteering = [{
    organization: "Aidcove Foundation",
    role: "Volunteer at Technology Committee and Fundraiser",
    period: "2021-2022",
    description: "Worked closely with the organization's technology committee and helped raise funds to provide covid-relief tools to local communities in need.",
    link: "https://www.instagram.com/aidcovefoundation/"
  }];

  return (
    <section id="experience" className="bg-gray-50 my-0 py-[10px]">
      <div className="container mx-auto px-6 bg-zinc-800">
        <div className="max-w-4xl mx-auto bg-zinc-800 pt-16 pb-16">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-gray-100">
            Experience & Education
          </h2>

          <div className="mb-16">
            <h3 className="text-2xl mb-8 text-slate-50 font-semibold">Education</h3>
            
            <div className="space-y-6">
              {education.map((edu, index) => (
                <a 
                  key={index} 
                  href={edu.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 bg-zinc-300 hover:bg-zinc-200 cursor-pointer transform hover:scale-105"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">{edu.school}</h4>
                      <p className="text-lg font-semibold text-zinc-600">{edu.degree}</p>
                    </div>
                    <span className="text-gray-500 font-medium mt-2 md:mt-0">{edu.period}</span>
                  </div>
                  <p className="text-gray-700 mb-2 leading-relaxed">{edu.description}</p>
                </a>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h3 className="text-2xl text-white mb-8 font-semibold">Volunteer Work</h3>
            
            <div className="space-y-6">
              {volunteering.map((vol, index) => (
                <a 
                  key={index} 
                  href={vol.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block bg-zinc-300 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-zinc-200 cursor-pointer transform hover:scale-105"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">{vol.organization}</h4>
                      <p className="text-lg font-semibold text-zinc-600">{vol.role}</p>
                    </div>
                    <span className="text-gray-500 font-medium mt-2 md:mt-0">{vol.period}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{vol.description}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;

