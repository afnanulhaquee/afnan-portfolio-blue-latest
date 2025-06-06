import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import html2pdf from 'html2pdf.js';
import { useTheme } from '../context/ThemeContext';
import { useSupabase, Experience, Certificate, Project } from '../context/SupabaseContext';

interface CVGeneratorProps {
  onGenerationComplete?: () => void;
}

const CVGenerator: React.FC<CVGeneratorProps> = ({ onGenerationComplete }) => {
  const { theme } = useTheme();
  const { getExperience, getCertificates, getProjects, getAbout } = useSupabase();
  const cvRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<{
    experiences: Experience[];
    certificates: Certificate[];
    projects: Project[];
    about: any;
  }>({
    experiences: [],
    certificates: [],
    projects: [],
    about: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [experiences, certificates, projects, about] = await Promise.all([
          getExperience(),
          getCertificates(),
          getProjects(),
          getAbout()
        ]);

        console.log('Fetched Data:', {
          experiences,
          certificates,
          projects,
          about
        });

        // Get the most recent about entry
        const latestAbout = about && about.length > 0 ? about[0] : null;

        setData({
          experiences,
          certificates,
          projects,
          about: latestAbout
        });
      } catch (error) {
        console.error('Error fetching CV data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getExperience, getCertificates, getProjects, getAbout]);

  useEffect(() => {
    const generatePDF = async () => {
      if (!cvRef.current || isLoading) return;

      console.log('Current Data State:', data);

      const element = cvRef.current;
      const opt = {
        margin: [15, 15, 15, 15],
        filename: 'Afnan_Ul_Haq_CV.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          scrollY: 0
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { 
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.page-break'
        }
      };

      try {
        await html2pdf().set(opt).from(element).save();
        onGenerationComplete?.();
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    };

    generatePDF();
  }, [isLoading, onGenerationComplete, data]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const content = (
    <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
      <div ref={cvRef} className="cv-container" style={{ 
        width: '210mm', 
        padding: '10mm',
        backgroundColor: 'white',
        color: 'black'
      }}>
        {/* Header with Profile Info */}
        <div className="cv-header" style={{ 
          display: 'flex', 
          marginBottom: '10px',
          gap: '10px',
          alignItems: 'center'
        }}>
          {data.about?.profile_picture && (
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
              border: '2px solid #f0f0f0'
            }}>
              <img 
                src={data.about.profile_picture} 
                alt="Profile" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover' 
                }} 
              />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{ 
              fontSize: '20px', 
              marginBottom: '2px',
              color: '#1a1a1a'
            }}>{data.about?.name || 'Afnan Ul Haq'}</h1>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '1px' }}>
              {data.about?.degree || 'BS Information Technology'}
            </p>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '1px' }}>
              {data.about?.university || 'International Islamic University Islamabad'}
            </p>
            <p style={{ fontSize: '12px', color: '#666' }}>
              {data.about?.email || 'afnanulhaq4@gmail.com'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Left Column */}
          <div style={{ flex: '1', maxWidth: '60%' }}>
            {/* About Section */}
            {data.about?.content && (
              <div className="cv-section" style={{ marginBottom: '10px' }}>
                <h2 style={{ 
                  fontSize: '14px', 
                  borderBottom: '1px solid #000', 
                  marginBottom: '4px',
                  paddingBottom: '2px'
                }}>About</h2>
                <p style={{ fontSize: '11px', lineHeight: '1.3', color: '#333' }}>
                  {data.about.content}
                </p>
              </div>
            )}

            {/* Experience Section */}
            <div className="cv-section" style={{ marginBottom: '10px' }}>
              <h2 style={{ 
                fontSize: '14px', 
                borderBottom: '1px solid #000', 
                marginBottom: '4px',
                paddingBottom: '2px'
              }}>Experience</h2>
              {data.experiences.map((exp, index) => (
                <div key={exp.id} style={{ marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '1px' }}>{exp.position}</h3>
                  <p style={{ fontSize: '11px', color: '#666', marginBottom: '1px' }}>{exp.organization}</p>
                  <p style={{ fontSize: '11px', color: '#666' }}>
                    {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                  </p>
                </div>
              ))}
            </div>

            {/* Projects Section */}
            <div className="cv-section" style={{ marginBottom: '10px' }}>
              <h2 style={{ 
                fontSize: '14px', 
                borderBottom: '1px solid #000', 
                marginBottom: '4px',
                paddingBottom: '2px'
              }}>Projects</h2>
              {data.projects.map((project) => (
                <div key={project.id} style={{ marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '1px' }}>{project.title}</h3>
                  {project.tags && typeof project.tags === 'string' && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                      {project.tags.split(',').map((tag, index) => (
                        <span key={index} style={{ 
                          padding: '1px 4px', 
                          backgroundColor: '#f0f0f0', 
                          borderRadius: '2px',
                          fontSize: '9px'
                        }}>
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div style={{ flex: '1', maxWidth: '40%' }}>
            {/* Certificates Section */}
            <div className="cv-section" style={{ marginBottom: '10px' }}>
              <h2 style={{ 
                fontSize: '14px', 
                borderBottom: '1px solid #000', 
                marginBottom: '4px',
                paddingBottom: '2px'
              }}>Certificates</h2>
              {data.certificates.map((cert) => (
                <div key={cert.id} style={{ marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '1px' }}>{cert.title}</h3>
                  <p style={{ fontSize: '11px', color: '#666', marginBottom: '1px' }}>{cert.issuer}</p>
                  <p style={{ fontSize: '11px', color: '#666' }}>
                    {new Date(cert.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export default CVGenerator; 