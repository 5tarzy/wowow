# Football GM Simulator — Stage 3

Vercel-ready React + TypeScript + Vite project.

## Stage 3 systems added

- League data model with multiple countries and clubs
- Real-world club names and recognizable player data foundation
- Full-squad architecture with contracts
- AI-controlled clubs
- Transfer market and AI negotiation generation
- Market value formula using age, form, potential and inflation
- Contract wages, expiry dates and squad status
- Injury engine with multiple injury types, severity and recovery
- Workload-based injury risk
- Youth academy prospect generation
- International national-team layer
- World Cup cycle
- U20 World Cup
- Continental championships
- Qualification windows
- Global scheduler foundations
- International-window congestion protection
- League fixture generation foundations
- Persistent IndexedDB saves
- Modular simulation engine architecture

## Run

```bash
npm install
npm run dev
```

## Vercel

Build command:
```bash
npm run build
```

Output directory:
```text
dist
```

## Important data note

The project includes recognizable real-world club/player data as a development seed. For a public commercial deployment, the real-world data source and licensing/attribution requirements should be reviewed before expanding the database at scale.

## Next major layer

- Full licensed/attributed global database ingestion
- Complete squads for all loaded clubs
- Promotion/relegation
- Domestic cup brackets
- Champions League / Europa League full competition formats
- Actual transfer completion and contract negotiation UI
- Staff, training and medical departments
- Advanced injury consequences and rehabilitation
- Full youth scouting by country and region
- Direct regens after retirement
- Complete all-time tracker and Hall of Fame
- Multi-decade world simulation optimization
