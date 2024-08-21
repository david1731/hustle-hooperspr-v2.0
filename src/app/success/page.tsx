'use client';

import React, {Suspense} from 'react';
import SuccessComponent from '@/components/Success';

export default function SuccessPage() {

  return (
    <div>
      <Suspense fallback={<>Loading...</>}>
        <SuccessComponent/>
      </Suspense>
    </div>
  );
}




