#!/usr/bin/env python3
# Restructure every course: 1 topic = 1 hour lesson; 30-min End of Topic Test per topic;
# 3 one-hour assessments (Baseline, Mid-course, Final). Total hours = taught + 0.5*topics + 3.
import json, re, os

# course_id -> list of (topic, [lesson titles])
P = {}

P["ib-aa-sl"] = [
 ("Number & Algebra", ["Sequences & series: arithmetic","Sequences & series: geometric","Sum to infinity & applications","Exponents & laws of indices","Logarithms & their laws","Solving exponential & log equations","Binomial theorem","Proof & deductive reasoning"]),
 ("Functions", ["Function notation, domain & range","Composite & inverse functions","Transformations of graphs","Quadratic functions & the discriminant","Rational & reciprocal functions"]),
 ("Trigonometry", ["Radians, arcs & sectors","The unit circle & exact values","Trigonometric identities","Solving trigonometric equations","Sine & cosine rules","Modelling with sinusoidal functions"]),
 ("Statistics & Probability", ["Sampling & describing data","Standard deviation & the GDC","Correlation & linear regression","Probability & Venn diagrams","Conditional probability & trees","Discrete random variables","Binomial distribution","Normal distribution"]),
 ("Calculus", ["Limits & the derivative","Differentiating polynomials","Tangents, normals & rates of change","Chain, product & quotient rules","Stationary points & curve sketching","Optimisation problems","Kinematics with calculus","Integration & antiderivatives","Definite integrals & area"]),
 ("Internal Assessment", ["Choosing & scoping your IA","Structuring the IA to the criteria"]),
]
P["ib-aa-hl"] = [
 ("Algebra & Proof", ["Sequences, series & sigma notation","Exponents & logarithms mastery","Binomial theorem with fractional indices","Proof by induction","Proof by contradiction & counterexample","Permutations & combinations","Partial fractions"]),
 ("Complex Numbers", ["Cartesian form & the Argand diagram","Modulus & argument","Polar & Euler form","De Moivre's theorem","Roots of complex numbers"]),
 ("Functions & Polynomials", ["Composite, inverse & piecewise functions","Polynomial division & the factor theorem","Sum & product of roots","Rational functions & oblique asymptotes","Modulus & reciprocal graphs"]),
 ("Trigonometry", ["Reciprocal & inverse trig functions","Compound & double angle identities","Solving advanced trig equations","Modelling with trig functions"]),
 ("Vectors", ["Vector algebra & the scalar product","Vector equations of lines","The vector product","Equations of planes","Intersections, angles & distances"]),
 ("Statistics & Probability", ["Distributions review: binomial & normal","Bayes' theorem","Probability with combinatorics","Linear combinations of variables"]),
 ("Calculus", ["Differentiation toolkit & implicit","Related rates","Optimisation under constraints","Integration by substitution","Integration by parts","Volumes of revolution","Maclaurin series","l'Hopital's rule","Differential equations: separable","Differential equations: integrating factor & Euler"]),
 ("Paper 3 & IA", ["Paper 3 investigation technique","Scoping an HL-depth IA"]),
]
P["ib-ai-sl"] = [
 ("Number & Finance", ["Standard form, accuracy & error","Simple & compound interest","Depreciation & the TVM solver","Annuities & amortisation"]),
 ("Modelling", ["Linear models in context","Quadratic & cubic models","Exponential growth & decay models","Sinusoidal models","Choosing & justifying a model"]),
 ("Geometry & Trigonometry", ["Right-angled trig & bearings","Sine & cosine rules","3D solids: surface area & volume","Coordinate geometry & perpendicular bisectors"]),
 ("Statistics", ["Sampling & presenting data","Measures of centre & spread","Correlation, regression & Spearman's rank","Chi-squared test","Two-sample t-test"]),
 ("Probability", ["Probability, Venn & tree diagrams","Conditional probability","Binomial distribution on the GDC","Normal distribution on the GDC"]),
 ("Calculus", ["Derivatives & rates of change","Optimisation basics","Definite integrals & area","The trapezoidal rule"]),
 ("Internal Assessment", ["Scoping a statistics-based IA"]),
]
P["ib-ai-hl"] = [
 ("Number, Finance & Logs", ["Error, bounds & log scales","Log-log linearisation","TVM: loans & annuities","Amortisation schedules"]),
 ("Matrices", ["Matrix algebra","Determinants & inverses","Solving systems with matrices","Transformations as matrices","Eigenvalues & eigenvectors","Markov chains & steady state"]),
 ("Graph Theory", ["Graphs, degrees & adjacency matrices","Walks, connectivity & trees","Minimum spanning trees","Chinese postman problem","Travelling salesman bounds"]),
 ("Geometry", ["Voronoi diagrams","Applied 3D trigonometry"]),
 ("Statistics", ["Distributions: binomial, normal & Poisson","Linear combinations & the CLT","Confidence intervals","Hypothesis testing suite","Type I & II errors","Non-linear regression & R-squared"]),
 ("Calculus", ["Differentiation & optimisation","Definite integration & volumes","Separable differential equations","Euler's method & slope fields","Logistic models","Coupled systems & phase portraits"]),
 ("Paper 3 & IA", ["Paper 3 investigation technique","Scoping an HL-depth IA"]),
]
P["ib-chem-sl"] = [
 ("Structure 1: Particulate Nature", ["States of matter & the mole","Atomic structure & isotopes","Mass spectra & emission spectra","Molar calculations & empirical formulae","The ideal gas equation"]),
 ("Structure 2: Bonding", ["Ionic bonding & lattices","Covalent bonding & Lewis structures","VSEPR shapes & polarity","Intermolecular forces","Metallic bonding"]),
 ("Structure 3: Classification", ["Periodic trends","Functional groups & nomenclature","Homologous series"]),
 ("Reactivity 1: Energetics", ["Enthalpy changes & calorimetry","Hess's law","Bond enthalpies"]),
 ("Reactivity 2: Rate & Extent", ["Equations, limiting reagent & yield","Collision theory & rates","Dynamic equilibrium & Kc","Le Chatelier's principle"]),
 ("Reactivity 3: What Reactions Do", ["Acids, bases & the pH scale","Titration calculations","Oxidation states & redox","Reactivity series & simple cells"]),
 ("Internal Assessment", ["Designing your IA investigation"]),
]
P["ib-chem-hl"] = [
 ("Structure 1: Particulate Nature", ["Atomic structure & the mole","Electron configuration & orbitals","Ionisation energy evidence","Mass spectrometry","Real vs ideal gases"]),
 ("Structure 2: Bonding", ["Ionic model & lattice enthalpy","Born-Haber cycles","Covalent bonding & VSEPR to 6 domains","Hybridisation & sigma/pi bonds","Resonance & delocalisation","Metallic bonding & alloys"]),
 ("Structure 3: Classification", ["Periodicity & the d-block","Transition metal complexes & colour","Functional groups & isomerism","Stereoisomerism"]),
 ("Spectroscopy", ["Infrared spectroscopy","Mass spectrometry of organics","1H NMR & splitting","Combined structure determination"]),
 ("Reactivity 1: Energetics", ["Calorimetry & Hess's law","Bond enthalpies","Entropy","Gibbs free energy & spontaneity"]),
 ("Reactivity 2: Rate & Extent", ["Quantitative chemistry & yield","Rate laws & order from data","The Arrhenius equation","Equilibrium: Kc, Kp & ICE tables"]),
 ("Reactivity 3: What Reactions Do", ["Acids, bases, Ka & pKa","Buffers & pH curves","Standard electrode potentials","Electrochemical & electrolytic cells","Free radical & nucleophilic substitution","Electrophilic addition & substitution","Multi-step organic synthesis"]),
 ("Internal Assessment", ["Scoping an HL IA with uncertainty"]),
]
P["al-math"] = [
 ("Pure: Algebra & Functions", ["Surds, indices & algebraic fractions","Quadratics & the discriminant","Simultaneous equations & inequalities","Polynomials & the factor theorem","Graphs & transformations","Partial fractions","Modulus functions"]),
 ("Pure: Coordinate Geometry & Sequences", ["Straight lines & circles","Binomial expansion","Arithmetic & geometric series","Sigma notation & proof"]),
 ("Pure: Trigonometry", ["Radians, arcs & sectors","Trig graphs & exact values","Identities & equations","Compound & double angles","The R-form"]),
 ("Pure: Exponentials & Calculus", ["e and natural logarithms","Exponential modelling","Differentiation from first principles","Chain, product & quotient rules","Implicit & parametric differentiation","Integration techniques","Differential equations","Numerical methods"]),
 ("Pure: Vectors", ["2D & 3D vectors","Vector geometry problems"]),
 ("Statistics", ["Sampling & data presentation","Probability & conditional probability","Discrete & binomial distributions","The normal distribution","Hypothesis testing"]),
 ("Mechanics", ["Kinematics & SUVAT","Forces & Newton's laws","Connected particles & friction","Moments & equilibrium","Projectile motion"]),
]
P["al-chem"] = [
 ("Physical: Foundations", ["Atomic structure & mass spectrometry","Amount of substance & the mole","Titration & gas calculations"]),
 ("Bonding & Structure", ["Ionic, covalent & metallic bonding","VSEPR shapes","Polarity & intermolecular forces"]),
 ("Energetics & Kinetics", ["Enthalpy & calorimetry","Hess's law & bond enthalpies","Collision theory & Maxwell-Boltzmann","Dynamic equilibrium & Kc"]),
 ("Inorganic", ["Periodicity of period 3","Group 2 chemistry","Group 7 halogens","Transition metals & complex ions","Redox titrations"]),
 ("Organic Foundations", ["Nomenclature & isomerism","Alkanes & free radical substitution","Halogenoalkanes & nucleophilic substitution","Alkenes & electrophilic addition","Alcohols & analysis (IR/MS)"]),
 ("Physical: Advanced", ["Born-Haber cycles","Entropy & Gibbs free energy","Rate equations & the Arrhenius equation","Kp & equilibria","pH, Ka & buffers","Electrode potentials & cells"]),
 ("Organic: Advanced", ["Aromatic chemistry","Carbonyls & carboxylic acids","Amines & condensation polymers","NMR structure determination"]),
]
P["gcse-math"] = [
 ("Number", ["Fractions, decimals & percentages","Indices & standard form","Surds","Bounds & error intervals"]),
 ("Algebra", ["Expanding & factorising","Solving linear equations","Quadratic equations","Rearranging formulae","Algebraic fractions","Sequences & the nth term","Inequalities","Simultaneous equations","Functions: composite & inverse"]),
 ("Graphs", ["Straight-line graphs","Quadratic & cubic graphs","Real-life & distance-time graphs","Graph transformations"]),
 ("Ratio & Proportion", ["Ratio & sharing","Direct & inverse proportion","Compound measures"]),
 ("Geometry", ["Angles & polygons","Circle theorems","Pythagoras' theorem","Trigonometry & exact values","Sine & cosine rules","Area, surface area & volume","Similar & congruent shapes","Vectors","Transformations"]),
 ("Probability & Statistics", ["Probability & tree diagrams","Averages & cumulative frequency","Histograms & box plots"]),
]
P["gcse-chem"] = [
 ("Atomic Structure & Periodic Table", ["Atoms, isotopes & electronic configuration","Development of the periodic table","Groups & periodic trends"]),
 ("Bonding & Structure", ["Ionic bonding","Covalent & metallic bonding","Structures & properties","Nanoparticles"]),
 ("Quantitative Chemistry", ["Conservation of mass & moles","Reacting masses","Concentration of solutions"]),
 ("Chemical Changes", ["Reactivity series & extraction","Acids, bases & salts","Electrolysis"]),
 ("Energy & Rate", ["Energy changes & profiles","Rates of reaction","Reversible reactions & equilibrium"]),
 ("Organic & Analysis", ["Crude oil, alkanes & alkenes","Tests for ions & gases","The atmosphere & pollutants"]),
]
P["pre-gcse-m"] = [
 ("Number Foundations", ["Place value & rounding","Operations with negatives & BIDMAS","Fractions","Decimals & percentages"]),
 ("Ratio & Proportion", ["Simplifying & sharing ratios","Recipe & map-scale problems"]),
 ("Algebra Foundations", ["Simplifying expressions & substitution","One-step & two-step equations","Expanding single brackets & factorising","Sequences & the nth term"]),
 ("Geometry", ["Coordinates & straight-line graphs","Angle facts & parallel lines","Perimeter & area","Volume of cuboids"]),
 ("Data Handling", ["Averages & range","Charts & pictograms","Simple probability"]),
 ("Problem Solving", ["Multi-step word problems & bar modelling"]),
]
P["pre-gcse-c"] = [
 ("Particles & Matter", ["The particle model","Changes of state & diffusion"]),
 ("Atoms & the Periodic Table", ["Atoms, elements & symbols","The periodic table layout"]),
 ("Mixtures & Separation", ["Compounds vs mixtures","Filtration, evaporation & distillation","Chromatography"]),
 ("Chemical Changes", ["Chemical vs physical change & word equations","Acids, alkalis & indicators","Metals & reactivity"]),
 ("Quantities & Materials", ["Conservation of mass & balancing equations","Earth chemistry & everyday materials"]),
]
P["pre-ib"] = [
 ("Algebraic Fluency", ["Indices & surds","Expanding & factorising","Algebraic fractions","Quadratics: all methods"]),
 ("Functions & Graphs", ["Function notation, domain & range","Straight lines & parabolas","GDC graphing skills"]),
 ("Trigonometry & Sequences", ["SOHCAHTOA & sine/cosine rules","Radians preview","Arithmetic & geometric patterns"]),
 ("Towards Calculus", ["Exponentials & logarithms preview","Gradient as a rate of change"]),
 ("Statistics & Skills", ["Averages, spread & probability","GDC mastery & IB command terms"]),
]
P["ap-chem"] = [
 ("Unit 1: Atomic Structure", ["Moles & molar mass","Mass spectra & isotopes","Electron configuration & PES","Periodic trends"]),
 ("Unit 2: Molecular Structure", ["Lewis diagrams & VSEPR","Bond polarity & hybridisation","Lattice energy & structure"]),
 ("Unit 3: IMFs & Properties", ["Intermolecular forces","Solids, liquids & gases","Ideal gas law","Solutions & Beer's law"]),
 ("Unit 4: Reactions", ["Reaction types & net ionic equations","Stoichiometry","Titrations"]),
 ("Unit 5: Kinetics", ["Rate laws from data","Integrated rate laws","Reaction mechanisms","Arrhenius & catalysis"]),
 ("Unit 6: Thermodynamics", ["Calorimetry & enthalpy","Hess's law","Bond & formation enthalpies"]),
 ("Unit 7: Equilibrium", ["Kc, Kp & the reaction quotient","ICE tables & Le Chatelier","Solubility & Ksp"]),
 ("Unit 8: Acids & Bases", ["pH, Ka & Kb","Titration curves","Buffers & Henderson-Hasselbalch"]),
 ("Unit 9: Thermo & Electrochem", ["Entropy & Gibbs free energy","Galvanic & electrolytic cells","Nernst & Faraday calculations"]),
]
P["hon-math"] = [
 ("Advanced Algebra", ["Polynomial operations & factoring","Rational expressions","Quadratics & complex numbers","Polynomial & rational equations"]),
 ("Functions", ["Function families & transformations","Inverse & composite functions","Exponential & logarithmic functions","Modelling with functions"]),
 ("Systems & Sequences", ["Linear systems & matrices","Arithmetic & geometric series","The binomial theorem"]),
 ("Trigonometry", ["The unit circle & radians","Trig functions & graphs","Identities & equations","Laws of sines & cosines"]),
 ("Pre-Calculus", ["Conic sections","Polar coordinates intro","Limits preview for calculus"]),
]
P["hon-chem"] = [
 ("Foundations", ["Measurement & significant figures","Atomic theory & isotopes","Electron configuration"]),
 ("Periodicity & Bonding", ["Periodic trends","Ionic & covalent bonding","Lewis structures & VSEPR","Polarity"]),
 ("Stoichiometry", ["Moles & molar mass","Balancing & reaction types","Limiting reactant & percent yield"]),
 ("States & Solutions", ["Kinetic theory & gas laws","Solubility & molarity","Dilutions & solution stoichiometry"]),
 ("Energy & Change", ["Thermochemistry & calorimetry","Reaction rates","Equilibrium & Le Chatelier"]),
 ("Acids, Bases & Redox", ["pH & neutralisation","Titration","Oxidation states & balancing redox"]),
]
P["ms-math"] = [
 ("Number Sense", ["Place value & rounding","Operations with whole numbers","Factors, multiples & primes","Integers & the number line","Operations with integers"]),
 ("Fractions, Decimals & Percentages", ["Equivalent fractions & simplifying","Adding & subtracting fractions","Multiplying & dividing fractions","Decimal operations","Converting fractions, decimals & percentages","Percentages of amounts"]),
 ("Ratio & Proportion", ["Introduction to ratios","Equivalent ratios & sharing","Unit rates","Proportional word problems"]),
 ("Algebra Foundations", ["Variables & writing expressions","Evaluating expressions","One-step equations","Two-step equations","Inequalities"]),
 ("Geometry & Measurement", ["Perimeter & area of 2D shapes","Circles: circumference & area","Area of compound shapes","Surface area of prisms","Volume of prisms","Angles & the coordinate plane"]),
 ("Data & Probability", ["Collecting & displaying data","Mean, median, mode & range","Introduction to probability","Probability of combined events","Multi-step problem solving"]),
]
P["ms-sci"] = [
 ("Science Skills", ["The scientific method & fair tests","Measurement & lab safety"]),
 ("Matter", ["States of matter","Physical & chemical properties","Atoms & elements"]),
 ("Forces & Energy", ["Speed, forces & motion","Gravity, friction & simple machines","Forms of energy & transfers"]),
 ("Living Systems", ["Cells & organ systems","Ecosystems & food webs","Cycles & human impact"]),
 ("Earth & Space", ["The rock cycle & weather","The solar system"]),
]
P["hs-math"] = [
 ("Linear Algebra", ["Linear equations & inequalities","Slope-intercept & graphing","Systems of equations","Applications of systems"]),
 ("Polynomials & Quadratics", ["Exponent rules","Polynomial operations & factoring","Quadratics by factoring","Completing the square & the formula","Quadratic graphs"]),
 ("Rational, Radical & Functions", ["Rational expressions & equations","Radical expressions & equations","Function notation, domain & range","Transformations & families of functions"]),
 ("Exponential & Trig", ["Exponential growth & decay","Logarithms","Right-triangle trigonometry","The unit circle & trig graphs"]),
 ("Probability, Stats & Pre-Calc", ["Data analysis & probability","Distributions","Sequences & series","Conic sections","Limits preview"]),
]
P["hs-chem"] = [
 ("Matter & Atoms", ["Classification of matter & measurement","Atomic theory & isotopes","Electron configuration"]),
 ("Periodicity & Bonding", ["Periodic trends","Ionic & covalent bonding","Naming compounds","Lewis structures & VSEPR"]),
 ("Reactions & Stoichiometry", ["Reaction types & balancing","Predicting products","Moles & mole ratios","Limiting reactant & percent yield"]),
 ("Gases & Solutions", ["Gas laws & the ideal gas equation","Molarity & dilutions"]),
 ("Energy, Acids & Rates", ["Thermochemistry & calorimetry","pH & neutralisation","Collision theory & rate factors"]),
]
P["igcse-math"] = [
 ("Number", ["Fractions, decimals & percentages","Indices & standard form","Bounds & rounding","Ratio & proportion"]),
 ("Algebra", ["Expanding & factorising","Linear equations & inequalities","Quadratic equations","Rearranging formulae","Algebraic fractions","Sequences & the nth term","Functions: composite & inverse"]),
 ("Coordinate Geometry & Graphs", ["Straight-line graphs","Quadratic & reciprocal graphs","Distance-time & speed-time graphs"]),
 ("Geometry & Trigonometry", ["Angles & polygons","Circle theorems","Pythagoras & SOHCAHTOA","Sine & cosine rules","Mensuration: area & volume","Similar shapes & scale factors"]),
 ("Vectors & Transformations", ["Column vectors & vector geometry","Transformations"]),
 ("Probability & Statistics", ["Probability, tree & Venn diagrams","Set notation","Averages & cumulative frequency","Histograms"]),
]
P["igcse-chem"] = [
 ("States & Separation", ["The particle model & changes of state","Diffusion","Mixtures & separation techniques"]),
 ("Atoms & Bonding", ["Atomic structure & isotopes","The periodic table & trends","Ionic, covalent & metallic bonding","Structures & properties"]),
 ("Stoichiometry", ["Relative masses & the mole","Reacting masses & concentrations","Percentage yield"]),
 ("Electrochemistry & Energetics", ["Electrolysis","Oxidation, reduction & reactivity","Exothermic & endothermic reactions","Rates of reaction"]),
 ("Equilibria & Organic", ["Reversible reactions & equilibrium","Acids, bases, pH & salts","Crude oil, alkanes & alkenes","Alcohols & carboxylic acids & polymers"]),
 ("Analysis", ["Tests for ions & gases","Chromatography & practical technique"]),
]
P["ial-math"] = [
 ("Pure 1", ["Surds & indices","Quadratics & the discriminant","Simultaneous equations & inequalities","Coordinate geometry & circles","Binomial expansion","Sequences & series"]),
 ("Pure 2", ["Trigonometry: radians & graphs","Identities & equations","Compound & double angles","Exponentials & logarithms","Differentiation","Integration"]),
 ("Pure 3 & 4", ["Reciprocal trig & further identities","Parametric differentiation","Numerical methods","Partial fractions","Vectors","Differential equations"]),
 ("Statistics", ["Data presentation & probability","Discrete random variables","The binomial distribution","The normal distribution","Hypothesis testing","Correlation & regression"]),
 ("Mechanics", ["Kinematics & SUVAT","Forces & Newton's laws","Friction & connected particles","Moments","Projectile motion"]),
]
P["ial-chem"] = [
 ("Foundations", ["Atomic structure & mass spectrometry","Amount of substance & the mole","Titration & gas calculations"]),
 ("Bonding & Structure", ["Ionic, covalent & metallic bonding","VSEPR shapes","Polarity & intermolecular forces"]),
 ("Energetics & Kinetics", ["Enthalpy & calorimetry","Hess's law & bond enthalpies","Collision theory & rates","Dynamic equilibrium & Kc"]),
 ("Inorganic", ["Periodicity","Group chemistry","Transition metals & complexes","Redox titrations"]),
 ("Organic Foundations", ["Nomenclature & isomerism","Alkanes & halogenoalkanes","Alkenes & electrophilic addition","Alcohols & analysis (IR/MS)"]),
 ("Advanced Physical & Organic", ["Born-Haber cycles","Entropy & Gibbs free energy","Rate equations & Arrhenius","Kp, pH, Ka & buffers","Electrode potentials & cells","Aromatics, carbonyls & polymers","NMR structure determination"]),
]

def obj_for(title):
    return f"Teach {title}: core concepts, fully worked examples, and the common exam pitfalls, then guided independent practice."
def hw_for(title):
    return f"Consolidation exercise on {title}, including two exam-style questions."

rows=[]            # {course_id,num,title,objectives,homework}
course_meta={}     # id -> {taught,topics,total_hours,half,q,rows}
for cid, plan in P.items():
    taught=sum(len(ls) for _,ls in plan)
    topics=len(plan)
    seq=0; out=[]
    def add(t,o,h):
        global seq
        seq+=1; out.append({"course_id":cid,"num":seq,"title":t,"objectives":o,"homework":h})
    add("Baseline Assessment (Pre-Test)","One-hour diagnostic across the whole syllabus to set your target grade and personalised study plan.","Review the diagnostic and note your three priority topics.")
    half=taught/2; done=0; mid_done=False
    for topic, lessons in plan:
        for l in lessons:
            add(l, obj_for(l), hw_for(l)); done+=1
        add(f"End of Topic Test: {topic}", f"30-minute test covering all of {topic}, marked immediately with feedback.", "Corrections on any marks dropped.")
        if not mid_done and done>=half:
            add("Mid-Course Assessment","One-hour cumulative assessment of the first half of the course; full mark-scheme review.","Complete corrections and a re-attempt of lost-mark questions.")
            mid_done=True
    if not mid_done:
        add("Mid-Course Assessment","One-hour cumulative assessment of the course so far; full mark-scheme review.","Complete corrections.")
    add("End-of-Course Assessment","One-hour full exam-style assessment of the entire course under timed conditions.","Targeted final revision plan from the assessment analysis.")
    total_hours = taught*1 + topics*0.5 + 3*1
    total_hours = round(total_hours)
    course_meta[cid]={"taught":taught,"topics":topics,"total_hours":total_hours,
                      "half":round(total_hours/2),"q":round(total_hours/4),"rows":len(out)}
    rows.extend(out)

# Write JSON import file into public/ so it deploys as a static asset.
os.makedirs("public", exist_ok=True)
with open("public/lessons-import.json","w") as f:
    json.dump(rows,f)
print("TOTAL_LESSON_ROWS", len(rows))
print("META", json.dumps(course_meta))

# Patch COURSES in src/App.jsx: replace hours{} and lessons:N, and inject taught/topics.
src=open("src/App.jsx").read()
for cid, m in course_meta.items():
    # match the course object start up to its lessons:NN,
    pat = re.compile(r'(\{id:"'+re.escape(cid)+r'",.*?hours:\{full:)\d+(,half:)\d+(,q:)\d+(\},lessons:)\d+(,)')
    def repl(mm):
        return (mm.group(1)+str(m["total_hours"])+mm.group(2)+str(m["half"])+mm.group(3)+str(m["q"])
                +mm.group(4)+str(m["rows"])+mm.group(5)+f'taught:{m["taught"]},topics:{m["topics"]},')
    src2,n = pat.subn(repl, src)
    if n!=1:
        print("WARN patch count", cid, n)
    else:
        src=src2
open("src/App.jsx","w").write(src)
print("PATCHED_APP_OK")
