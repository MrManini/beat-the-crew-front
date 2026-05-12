"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ScreenControl() {
  const sendCommand = (command: string) => {
    // Use localStorage to communicate with screen page
    localStorage.setItem("btc_screen_command", command)
    // Trigger storage event for same-origin pages
    window.dispatchEvent(new StorageEvent("storage", {
      key: "btc_screen_command",
      newValue: command,
    }))
  }

  const openScreenWindow = (mode: "bracket" | "logo") => {
    const url = `/screen?mode=${mode}`
    window.open(url, "btc_screen", "width=1920,height=1080")
  }

  return (
    <Card className="bg-btc-dark-lighter border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-foreground text-sm uppercase tracking-wider">
          Control de Pantalla TV
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mode buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => sendCommand("show_bracket")}
            className="flex-1 bg-btc-purple text-foreground hover:bg-btc-purple-light"
          >
            Mostrar Bracket
          </Button>
          <Button
            onClick={() => sendCommand("show_logo")}
            variant="outline"
            className="flex-1 border-border text-foreground hover:bg-muted"
          >
            Mostrar Logo
          </Button>
        </div>

        {/* Open in new window */}
        <div className="flex gap-2">
          <Button
            onClick={() => openScreenWindow("bracket")}
            variant="ghost"
            className="flex-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Abrir Bracket en Ventana
          </Button>
          <Button
            onClick={() => openScreenWindow("logo")}
            variant="ghost"
            className="flex-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Abrir Logo en Ventana
          </Button>
        </div>

        {/* Group selector */}
        <div className="flex gap-2">
          <Button
            onClick={() => sendCommand("group:CREW")}
            variant="outline"
            className="flex-1 text-xs border-btc-yellow text-btc-yellow hover:bg-btc-yellow hover:text-btc-dark"
          >
            Grupo Crew
          </Button>
          <Button
            onClick={() => sendCommand("group:INVITED")}
            variant="outline"
            className="flex-1 text-xs border-btc-purple text-btc-purple hover:bg-btc-purple hover:text-foreground"
          >
            Grupo Invitados
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
