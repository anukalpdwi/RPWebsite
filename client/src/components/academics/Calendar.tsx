import { useState } from "react";
import SectionTitle from "@/components/ui/section-title";
import { motion } from "framer-motion";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Academic terms data
const terms = [
  {
    name: "First Term",
    startDate: "April 1, 2023",
    endDate: "September 30, 2023",
    events: [
      { date: "April 1, 2023", event: "New Academic Session Begins" },
      { date: "April 10, 2023", event: "Annual Day Celebration" },
      { date: "May 15-20, 2023", event: "First Unit Test" },
      { date: "June 5, 2023", event: "World Environment Day Activities" },
      { date: "July 1-15, 2023", event: "Mid-Term Examination" },
      { date: "August 15, 2023", event: "Independence Day Celebration" },
      { date: "September 5, 2023", event: "Teachers' Day Celebration" },
      { date: "September 20-30, 2023", event: "First Term Examination" },
    ]
  },
  {
    name: "Second Term",
    startDate: "October 1, 2023",
    endDate: "March 31, 2024",
    events: [
      { date: "October 2, 2023", event: "Gandhi Jayanti Celebration" },
      { date: "October 24-28, 2023", event: "Diwali Vacation" },
      { date: "November 14, 2023", event: "Children's Day Celebration" },
      { date: "November 20, 2023", event: "Inter-school Science Exhibition" },
      { date: "December 15, 2023", event: "Annual Sports Meet" },
      { date: "December 25-January 1, 2024", event: "Winter Vacation" },
      { date: "January 26, 2024", event: "Republic Day Celebration" },
      { date: "February 5-10, 2024", event: "Pre-Board Examination for Classes X & XII" },
      { date: "March 1-15, 2024", event: "Annual Examination" },
      { date: "March 31, 2024", event: "Academic Session Ends" },
    ]
  }
];

// Holiday list data
const holidays = [
  { date: "April 14, 2023", day: "Friday", occasion: "Dr. Ambedkar Jayanti" },
  { date: "May 1, 2023", day: "Monday", occasion: "Labour Day" },
  { date: "August 15, 2023", day: "Tuesday", occasion: "Independence Day" },
  { date: "August 30, 2023", day: "Wednesday", occasion: "Raksha Bandhan" },
  { date: "September 19, 2023", day: "Tuesday", occasion: "Ganesh Chaturthi" },
  { date: "October 2, 2023", day: "Monday", occasion: "Gandhi Jayanti" },
  { date: "October 24, 2023", day: "Tuesday", occasion: "Dussehra" },
  { date: "November 12, 2023", day: "Sunday", occasion: "Diwali" },
  { date: "December 25, 2023", day: "Monday", occasion: "Christmas" },
  { date: "January 26, 2024", day: "Friday", occasion: "Republic Day" },
  { date: "March 8, 2024", day: "Friday", occasion: "Holi" },
  { date: "March 29, 2024", day: "Friday", occasion: "Good Friday" },
];

// Exam schedule data
const examSchedules = [
  {
    type: "Unit Tests",
    schedules: [
      { class: "I-V", dates: "May 15-18, 2023 & November 15-18, 2023" },
      { class: "VI-VIII", dates: "May 15-20, 2023 & November 15-20, 2023" },
      { class: "IX-X", dates: "May 15-22, 2023 & November 15-22, 2023" },
      { class: "XI-XII", dates: "May 15-25, 2023 & November 15-25, 2023" },
    ]
  },
  {
    type: "Mid-Term Examinations",
    schedules: [
      { class: "I-V", dates: "July 1-8, 2023" },
      { class: "VI-VIII", dates: "July 1-10, 2023" },
      { class: "IX-X", dates: "July 1-12, 2023" },
      { class: "XI-XII", dates: "July 1-15, 2023" },
    ]
  },
  {
    type: "Term-End Examinations",
    schedules: [
      { class: "I-V", dates: "September 20-27, 2023 & March 1-8, 2024" },
      { class: "VI-VIII", dates: "September 20-30, 2023 & March 1-10, 2024" },
      { class: "IX-X", dates: "September 20-30, 2023 & March 1-15, 2024" },
      { class: "XI-XII", dates: "September 20-30, 2023 & March 1-15, 2024" },
    ]
  },
  {
    type: "Pre-Board Examinations (Class X & XII)",
    schedules: [
      { class: "X", dates: "December 10-20, 2023 & February 5-15, 2024" },
      { class: "XII", dates: "December 10-20, 2023 & February 5-15, 2024" },
    ]
  }
];

export default function Calendar() {
  const [selectedTerm, setSelectedTerm] = useState("First Term");
  
  const currentTerm = terms.find(term => term.name === selectedTerm) || terms[0];
  
  return (
    <section id="calendar" className="py-16">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Academic Calendar" 
          subtitle="Stay updated with important dates, events, holidays, and examination schedules for the current academic year."
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="mb-6">
              <h3 className="text-2xl font-heading font-bold text-primary mb-4">Academic Year 2023-2024</h3>
              <p className="mb-4">The academic year at RP Public School is divided into two terms:</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span><strong>First Term:</strong> April 1, 2023 to September 30, 2023</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span><strong>Second Term:</strong> October 1, 2023 to March 31, 2024</span>
                </li>
              </ul>
            </div>
            
            <div className="mb-4 max-w-xs">
              <label className="block text-sm font-medium mb-1">Select Term</label>
              <Select 
                value={selectedTerm} 
                onValueChange={setSelectedTerm}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Term" />
                </SelectTrigger>
                <SelectContent>
                  {terms.map((term, i) => (
                    <SelectItem key={i} value={term.name}>{term.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <h4 className="text-lg font-heading font-bold mb-3">{currentTerm.name}: {currentTerm.startDate} to {currentTerm.endDate}</h4>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">Date</TableHead>
                      <TableHead>Event</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTerm.events.map((event, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{event.date}</TableCell>
                        <TableCell>{event.event}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-heading font-bold text-primary mb-4">Holiday List 2023-2024</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Day</TableHead>
                      <TableHead>Occasion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {holidays.map((holiday, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{holiday.date}</TableCell>
                        <TableCell>{holiday.day}</TableCell>
                        <TableCell>{holiday.occasion}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="text-sm mt-4">
                <strong>Note:</strong> Additional holidays may be declared by the government or school administration. Parents and students will be notified accordingly.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-heading font-bold text-primary mb-4">Examination Schedule</h3>
              
              <Accordion type="single" collapsible className="w-full">
                {examSchedules.map((schedule, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger className="text-left font-heading font-medium">
                      {schedule.type}
                    </AccordionTrigger>
                    <AccordionContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Class</TableHead>
                            <TableHead>Dates</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {schedule.schedules.map((item, j) => (
                            <TableRow key={j}>
                              <TableCell>{item.class}</TableCell>
                              <TableCell>{item.dates}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <p className="text-sm mt-4">
                <strong>Note:</strong> Detailed exam schedules with subject-wise timetables will be issued at least two weeks before the examinations.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
