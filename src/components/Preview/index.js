import React, { useState, useRef } from 'react';
import { Box, Button } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PersonalInfoPreview from './PersonalInfoPreview';
import EducationPreview from './EducationPreview';
import ExperiencePreview from './ExperiencePreview';
import SkillsPreview from './SkillsPreview';
import ProjectsPreview from './ProjectsPreview';
import { dummyData } from "../../data";

const Preview = () => {
    const data = dummyData;
    const personalInfo = data.personalInfo;
    const education = data.education;
    const experience = data.experience;
    const skills = data.skills;
    const projects = data.projects;

    const [componentOrder, setComponentOrder] = useState(['Education', 'Experience', 'Skills']);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const components = {
        Education: <EducationPreview education={education} />,
        Experience: <ExperiencePreview experience={experience} />,
        Skills: <SkillsPreview skills={skills} />
    };

    const moveComponent = (component, direction) => {
        const index = componentOrder.indexOf(component);
        const newIndex = index + direction;

        if (newIndex < 0 || newIndex === componentOrder.length) return;

        const newComponentOrder = [...componentOrder];
        newComponentOrder[index] = newComponentOrder[newIndex];
        newComponentOrder[newIndex] = component;

        setComponentOrder(newComponentOrder);
    };

    const previewRef = useRef();

    const downloadPdf = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
        html2canvas(previewRef.current, { scale: 2 }).then(canvas => { // Increase scale for higher quality
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a3'); // Use larger page size
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const widthRatio = pageWidth / canvas.width;
            const heightRatio = pageHeight / canvas.height;
            const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

            const canvasWidth = canvas.width * ratio;
            const canvasHeight = canvas.height * ratio;

            const marginX = (pageWidth - canvasWidth) / 2;
            const marginY = (pageHeight - canvasHeight) / 2;

            pdf.addImage(imgData, 'PNG', marginX, marginY, canvasWidth, canvasHeight);

            setTimeout(() => {
                pdf.save(`${personalInfo.name}'s Resume.pdf`);
                setIsGeneratingPdf(false);
            }, 1000);
        });
    }, 1000);
};

    return (
        <Box className="preview"
             sx={{ width: '100%', maxWidth: 800, mx: 'auto', my: 2, p: 2, border: '1px solid grey', borderRadius: 1 }}
             ref={previewRef}>
            <PersonalInfoPreview personalInfo={personalInfo} />
            {componentOrder.map((component, index) => (
                <div key={component} className="component-container">
                    {components[component]}
                    <div className="move-buttons">
                        <Button onClick={() => moveComponent(component, -1)}>Move Up</Button>
                        <Button onClick={() => moveComponent(component, 1)}>Move Down</Button>
                    </div>
                </div>
            ))}
            <ProjectsPreview projects={projects} />
            {isGeneratingPdf ? null : <Button onClick={downloadPdf}>Download as PDF</Button>}
        </Box>
    );
};

export default Preview;