import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from 'components/ui/card';
import { Button } from 'components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select';
import { Slider } from 'components/ui/slider';
import { Play, Pause, SkipBack, Save, Copy, Trash2, Plus } from 'lucide-react';
import { Alert, AlertDescription } from 'components/ui/alert'; 